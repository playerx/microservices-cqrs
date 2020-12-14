import { DynamicModule, Module } from '@nestjs/common'
import { CqrsModule } from '../../core/cqrs/cqrs.module'
import { Queue } from '../../core/queue'
import {
  UserCommand,
  UserCommandCqrs,
  UserQuery,
  UserQueryCqrs,
} from '../user'
import { PortalEventListener } from './lib/portal.event'

@Module({
  providers: [
    { provide: UserCommand, useClass: UserCommandCqrs },
    { provide: UserQuery, useClass: UserQueryCqrs },
    PortalEventListener,
  ],
})
export class PortalModule {
  static forRoot(options: { queue: Queue }): DynamicModule {
    return {
      module: PortalModule,
      imports: [
        CqrsModule.forRoot({
          queue: options.queue,
        }),
      ],
    }
  }
}
