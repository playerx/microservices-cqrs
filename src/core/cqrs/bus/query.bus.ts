import { Injectable } from '@nestjs/common'
import { TPayload } from '../../queue'
import { CqrsBusType } from '../cqrs.tokens'
import { GenericBus } from './generic.bus'
import { IQueryBus } from './interfaces/queryBus.interface'

export interface QueryBusOptions {
  listenRoutePrefixes?: string[]
}

@Injectable()
export class QueryBus<TQuery extends TPayload<TQuery>>
  extends GenericBus<TQuery>
  implements IQueryBus<TQuery> {
  readonly __type = CqrsBusType.Query
}
