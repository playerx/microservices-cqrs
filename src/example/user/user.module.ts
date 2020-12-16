import { DynamicModule, Module } from '@nestjs/common'
import { CqrsModule } from '../../core/cqrs/cqrs.module'
import { Queue } from '../../core/queue'
import { UserCommand } from './lib/user.command'
import { UserEventListener } from './lib/user.event'
import { UserQuery } from './lib/user.query'
import { UserRepo } from './lib/user.repo'

@Module({
  providers: [UserRepo, UserCommand, UserQuery, UserEventListener],
})
export class UserModule {
  static forRoot(options: { queue: Queue }): DynamicModule {
    return {
      module: UserModule,
      imports: [
        CqrsModule.forRoot({
          queue: options.queue,
          commandServices: [],
          queryServices: [],
        }),
      ],
    }
  }
}
