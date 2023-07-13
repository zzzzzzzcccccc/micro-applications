import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'
import { useCallback, useState, useRef } from 'react'

type CancelTokenKeys = {
  current: string
  prev: string
}

type RequestState<ResponseData> = {
  data: ResponseData
  error: unknown
  loading: boolean
  errorData?: unknown
}

type Options<ResponseData> = {
  initialState?: RequestState<ResponseData>
  enabledCancel?: boolean
  cancelKeys?: CancelTokenKeys
}

type RunRequestOptions = {
  onCurrentCancel?: (error: unknown) => void
  onError?: (error: unknown) => void
}

const DEFAULT_OPTIONS: Options<any> = {
  initialState: {
    data: null,
    error: null,
    loading: false,
    errorData: null,
  },
  enabledCancel: true,
  cancelKeys: {
    current: 'CancelCurrentRequest',
    prev: 'CancelPrevRequest',
  },
}

export default function useRequest<ResponseData, RequestPayload>(
  httpClient: AxiosInstance,
  options: Options<ResponseData>,
) {
  const {
    enabledCancel = DEFAULT_OPTIONS.enabledCancel,
    initialState = DEFAULT_OPTIONS.initialState,
    cancelKeys = DEFAULT_OPTIONS.cancelKeys,
  } = options
  const axiosCancelRef = useRef<CancelTokenSource>()

  const [state, setState] = useState(initialState as RequestState<ResponseData>)

  const run = useCallback(
    async (config: AxiosRequestConfig<RequestPayload>, options?: RunRequestOptions) => {
      const cancelCurrentKey = cancelKeys?.current || DEFAULT_OPTIONS.cancelKeys?.current
      const cancelPrevKey = cancelKeys?.prev || DEFAULT_OPTIONS.cancelKeys?.prev
      setState((prev) => ({ ...prev, loading: true }))
      try {
        if (enabledCancel) {
          if (axiosCancelRef.current) {
            axiosCancelRef.current.cancel(cancelPrevKey)
          }
          axiosCancelRef.current = axios.CancelToken.source()
          config.cancelToken = axiosCancelRef.current.token
        }
        const response = await httpClient.request<ResponseData, AxiosResponse<ResponseData>, RequestPayload>(config)

        setState({ data: response?.data, error: null, loading: false, errorData: null })

        return response.data
      } catch (error: unknown) {
        const data = null as ResponseData
        if ((error as Error)?.message === cancelCurrentKey) {
          options?.onCurrentCancel?.(error)
        } else {
          setState({
            data,
            error,
            loading: (error as Error)?.message === cancelPrevKey,
            errorData: (error as any)?.response?.data,
          })
          options?.onError?.(error)
        }
        return data
      }
    },
    [httpClient, enabledCancel, cancelKeys],
  )

  const cancel = useCallback(() => {
    if (enabledCancel && axiosCancelRef.current) {
      axiosCancelRef.current.cancel(cancelKeys?.current || DEFAULT_OPTIONS.cancelKeys?.current)
    }
  }, [enabledCancel, cancelKeys])

  return {
    ...state,
    data: state.data as ResponseData,
    run,
    cancel,
  }
}
