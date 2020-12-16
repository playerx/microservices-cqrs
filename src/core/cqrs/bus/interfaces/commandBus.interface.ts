import { TPayload, TMetadata } from '../../../queue/types'
import { CqrsBusType } from '../../cqrs.tokens'
import { ICqrsBus } from './bus.interface'

export interface ICommandBus<TCommand extends TPayload<TCommand>>
  extends ICqrsBus<TCommand, TMetadata> {
  readonly __type: CqrsBusType.Command
}
