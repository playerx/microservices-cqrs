import { Injectable } from '@nestjs/common'
import { TPayload } from '../../queue'
import { CqrsBusType } from '../cqrs.tokens'
import { GenericBus } from './generic.bus'
import { ICommandBus } from './interfaces/commandBus.interface'

export interface CommandBusOptions {}

@Injectable()
export class CommandBus<TCommand extends TPayload<TCommand>>
  extends GenericBus<TCommand>
  implements ICommandBus<TCommand> {
  readonly __type = CqrsBusType.Command
}
