import { Injectable } from '@nestjs/common'
import { QueryBus } from '../../../../core/cqrs/bus/query.bus'
import { Props } from '../../../../core/types'
import { UserDb } from '../models/user.db'
import { UserQuery } from '../user.query'

export interface UserQueryImpl extends UserQuery {}

export type UserQueryMessage =
  | ({
      $type: 'User.ById'
    } & Props<UserQuery['byId']>)
  | ({
      $type: 'User.List'
    } & Props<UserQuery['list']>)

/**
 * User Commands SDK for another microservices
 * Features 100% type safety
 */
@Injectable()
export class UserQueryCqrs implements UserQueryImpl {
  repo: any

  constructor(private queryBus: QueryBus<UserQueryMessage>) {}

  async byId<T extends UserQuery['byId']>(props: Props<T>) {
    return this.queryBus.publish<ReturnType<T>>({
      $type: 'User.ById',
      ...props,
    })
  }

  async list<T extends UserQuery['list']>(
    props: Props<T>,
  ): Promise<UserDb[]> {
    return this.queryBus.publish<ReturnType<T>>({
      $type: 'User.List',
      ...props,
    })
  }
}

/**
 * User Query handler, can be used only internally
 */
@Injectable()
export class UserQueryHandler {
  constructor(
    private queryBus: QueryBus<UserQueryMessage>,
    private impl: UserQuery,
  ) {
    console.log('UserQueryHandler.constructor')
  }

  onModuleInit() {
    console.log('UserQueryHandler.onModuleInit')

    this.queryBus.subscribe(message => {
      switch (message.$type) {
        case 'User.ById':
          return this.impl.byId(message)

        case 'User.List':
          return this.impl.list(message)
      }
    })
  }
}
