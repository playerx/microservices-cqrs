import { Injectable } from '@nestjs/common'
import { CommandBus } from '../../../../core/cqrs/bus/command.bus'
import { Props } from '../../../../core/types'
import { UserCommand } from '../user.command'

export interface UserCommandImpl extends UserCommand {}

/**
 * Data contract shared between microservices
 */
export type UserCommandMessage =
  | ({
      $type: 'User.Login'
    } & Props<UserCommand['login']>)
  | ({
      $type: 'User.Register'
    } & Props<UserCommand['register']>)

/**
 * User Commands SDK for another microservices
 * Features 100% type safety
 */
@Injectable()
export class UserCommandCqrs implements UserCommandImpl {
  repo: any
  eventBus: any

  constructor(private commandBus: CommandBus<UserCommandMessage>) {}

  async login<T extends UserCommand['login']>(props: Props<T>) {
    return this.commandBus.publish<ReturnType<T>>({
      $type: 'User.Login',
      ...props,
    })
  }

  async register<T extends UserCommand['register']>(props: Props<T>) {
    return this.commandBus.publish<ReturnType<T>>({
      $type: 'User.Register',
      ...props,
    })
  }
}

/**
 * User Command handler, used only internally
 */
@Injectable()
export class UserCommandHandler {
  constructor(
    private commandBus: CommandBus<UserCommandMessage>,
    private impl: UserCommand,
  ) {}

  onModuleInit() {
    this.commandBus.subscribe(message => {
      switch (message.$type) {
        case 'User.Login':
          return this.impl.login(message)

        case 'User.Register':
          return this.impl.register(message)
      }
    })
  }
}
