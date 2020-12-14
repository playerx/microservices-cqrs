import { Observable, Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { PublishProps, Queue, QueueItem } from './types'

interface Options {
  name: string
  newId: () => string
}

// shared for all instances
// because it's in memory
const internal$ = new Subject<QueueItem<any>>()
const internalResponse$ = new Subject<QueueItem<any>>()

export class MemoryQueue<TMessage> implements Queue {
  name: string
  message$: Observable<QueueItem<TMessage>>
  unsubscribe$ = new Subject()

  constructor(private options: Options) {
    this.name = options.name

    this.message$ = internal$
  }

  dispose(): void {
    throw new Error('Method not implemented.')
  }

  async publish<TResult>(
    props: PublishProps<TMessage>,
  ): Promise<TResult> {
    const { newId } = this.options

    const { message, metadata, route, rpc } = props

    const correlationId = rpc ? newId() : undefined

    const result = rpc?.enabled
      ? new Promise<TResult>((resolve, reject) => {
          const sub = internalResponse$
            .pipe(filter(x => x.correlationId === correlationId))
            .subscribe(x => {
              sub.unsubscribe()
              clearTimeout(timer)

              resolve(<TResult>(<unknown>x.message || null))

              x.complete()
            })

          const timer = setTimeout(() => {
            sub.unsubscribe()
            clearTimeout(timer)

            reject('QUEUE_RPC_TIMEOUT')
          }, rpc.timeout)
        })
      : Promise.resolve(null!)

    internal$.next({
      message,
      metadata,
      route,
      correlationId,
      replyTo: 'SELF',
      complete: () => {},
      sendReply: async (result, metadata) => {
        internalResponse$.next({
          route,
          message: result,
          metadata,
          correlationId,
          complete: () => null,
          sendReply: () => Promise.resolve(),
        })
      },
    })

    return result
  }
}
