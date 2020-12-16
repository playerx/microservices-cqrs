import { DynamicModule, Module } from '@nestjs/common'
import { CqrsModule } from '../../core/cqrs/cqrs.module'
import { Queue } from '../../core/queue'
import { UserCommand, UserQuery } from '../user'
import { UserQueryCqrs } from '../user/shared/user.query.shared'
import { NotificationEventListener } from './lib/notification.event'

@Module({
  providers: [NotificationEventListener],
})
export class NotificationModule {
  static forRoot(options: { queue: Queue }): DynamicModule {
    return {
      module: NotificationModule,
      imports: [
        CqrsModule.forRoot({
          queue: options.queue,
          queryServices: [UserQueryCqrs],
        }),
      ],
    }
  }
}
