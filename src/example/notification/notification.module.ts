import { DynamicModule, Module } from '@nestjs/common'
import { CqrsModule } from '../../core/cqrs/cqrs.module'
import { Queue } from '../../core/queue'
import {
  UserCommand,
  UserCommandCqrs,
  UserQuery,
  UserQueryCqrs,
} from '../user'
import { NotificationEventListener } from './lib/notification.event'

@Module({
  providers: [
    {
      provide: UserCommand,
      useClass: UserCommandCqrs,
    },
    {
      provide: UserQuery,
      useClass: UserQueryCqrs,
    },
    NotificationEventListener,
  ],
})
export class NotificationModule {
  static forRoot(options: { queue: Queue }): DynamicModule {
    return {
      module: NotificationModule,
      imports: [
        CqrsModule.forRoot({
          queue: options.queue,
        }),
      ],
    }
  }
}
