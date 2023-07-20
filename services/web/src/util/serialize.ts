export function serializeData<T>(data: T): T {
  if (data instanceof Array) {
    return data.map((item) => serializeData(item)) as T
  } else if (typeof data === 'object' && data !== null) {
    const serializedData: any = {}
    for (const [key, value] of Object.entries(data)) {
      serializedData[key] = serializeValue(value)
    }
    return serializedData as T
  } else {
    return data as T
  }
}

export function serializeValue<T>(value: T): any {
  if (typeof value === 'bigint') {
    return value.toString()
  } else if (value instanceof Date) {
    return value.toISOString()
  } else if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item))
  } else if (typeof value === 'object' && value !== null) {
    return serializeData(value)
  } else {
    return value as T
  }
}

export function serializeKeysAndValues<T extends Record<string, any>>(record = {} as T) {
  return Object.keys(record).reduce((acc, key) => {
    const value = record[key] ?? ''
    acc = [...acc, `${key}=${value}`]
    return acc
  }, [] as string[])
}

export function serializeJsonParse<T>(target: string, defaultValue: T, onError?: (e: any) => void) {
  try {
    return JSON.parse(target) as T
  } catch (e: any) {
    onError?.(e)
    return defaultValue || target
  }
}

export function serializeJsonString<T>(target: T, onError?: (e: any) => void) {
  try {
    return JSON.stringify(target)
  } catch (e) {
    onError?.(e)
    return ''
  }
}
