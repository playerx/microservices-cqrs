import { DynamicModule, Module } from '@nestjs/common'
import { CqrsModule } from '../../core/cqrs/cqrs.module'
import { Queue } from '../../core/queue'
import { UserCommandHandler } from './lib/cqrs/user.command.cqrs'
import { UserQueryHandler } from './lib/cqrs/user.query.cqrs'
import { UserCommand } from './lib/user.command'
import { UserEventListener } from './lib/user.event'
import { UserQuery } from './lib/user.query'
import { UserRepo } from './lib/user.repo'

@Module({
  providers: [
    UserRepo,
    UserCommand,
    UserCommandHandler,
    UserQuery,
    UserQueryHandler,
    UserEventListener,
  ],
})
export class UserModule {
  static forRoot(options: { queue: Queue }): DynamicModule {
    return {
      module: UserModule,
      imports: [
        CqrsModule.forRoot({
          queue: options.queue,
        }),
      ],
    }
  }
}
