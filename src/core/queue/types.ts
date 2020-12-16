import { Observable } from 'rxjs'
import { IMessageIdParts } from '../utility/routeKey/types'

export interface Queue {
  name: string

  message$: Observable<QueueItem<any>>
  unsubscribe$: Observable<any>

  publish<TResult>(props: PublishProps<any>): Promise<TResult>
  /** for adding new messageId subscriptions */
  subscribe(args: Partial<IMessageIdParts>): Promise<void> | void

  dispose(): void
}

export interface PublishProps<T> {
  route: string
  message: T

  metadata: TMetadata

  rpc?: {
    enabled: boolean
    timeout: number
  }
}

export interface QueueItem<T> {
  route: string
  message: T

  metadata: TMetadata

  // used with correlationId when its RPC
  replyTo?: string
  correlationId?: string

  complete: (isSuccess?: boolean) => void
  sendReply(result: any, metadata: TMetadata): Promise<void>
}

export type TMetadata = { [key: string]: string | TMetadata }

// export interface PendingItem<T> {
//   message: T
//   metadata: {}
//   complete(isSuccess?: boolean): void
//   isWaitingForReply: boolean
//   sendReplyAction(result: any): Promise<void>
// }

export type TPayload<T extends TPayload<T>> =
  | Record<string, T>
  | Array<T>
  | string
  | boolean
  | number
  | null
  | undefined
