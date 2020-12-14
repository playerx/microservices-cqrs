import { Observable } from 'rxjs'

export interface Queue {
  name: string

  message$: Observable<QueueItem<any>>
  unsubscribe$: Observable<any>

  publish<TResult>(props: PublishProps<any>): Promise<TResult>

  dispose(): void
}

export interface PublishProps<T> {
  route: string
  message: T

  metadata: Metadata

  rpc?: {
    enabled: boolean
    timeout: number
  }
}

export interface QueueItem<T> {
  route: string
  message: T

  metadata: Metadata

  // used with correlationId when its RPC
  replyTo?: string
  correlationId?: string

  complete: (isSuccess?: boolean) => void
  sendReply(result: any, metadata: Metadata): Promise<void>
}

export type Metadata = { [key: string]: string | Metadata }

// export interface PendingItem<T> {
//   message: T
//   metadata: {}
//   complete(isSuccess?: boolean): void
//   isWaitingForReply: boolean
//   sendReplyAction(result: any): Promise<void>
// }

export type Message<T extends Message<T>> = {
  $type: T['$type']
}
