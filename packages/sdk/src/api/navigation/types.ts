import { Update, To } from 'history'

export type Callback = (update: Update) => void
export type SynchronizeHistoryPayload = {
  pathname: string
  onChange?: (update: Update) => void
}
export { Update, To }
