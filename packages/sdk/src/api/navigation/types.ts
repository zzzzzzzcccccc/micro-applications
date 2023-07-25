import { Update } from 'history'
import { HistoryMode } from '../../types'

export interface Options {
  historyMode: HistoryMode
}
export type Callback = (update: Update) => void
