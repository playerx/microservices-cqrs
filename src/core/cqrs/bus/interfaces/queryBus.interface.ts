import { TPayload, TMetadata } from '../../../queue/types'
import { CqrsBusType } from '../../cqrs.tokens'
import { ICqrsBus } from './bus.interface'

export interface IQueryBus<TQuery extends TPayload<TQuery>>
  extends ICqrsBus<TQuery, TMetadata> {
  readonly __type: CqrsBusType.Query
}
