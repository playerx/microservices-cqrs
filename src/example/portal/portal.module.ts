import { DynamicModule, Module } from '@nestjs/common'
import { CqrsModule } from '../../core/cqrs/cqrs.module'
import { Queue } from '../../core/queue'
import { UserCommand } from '../user'
import { UserCommandCqrs } from '../user/shared/user.command.shared'
import { UserQueryCqrs } from '../user/shared/user.query.shared'
import { PortalEventListener } from './lib/portal.event'

@Module({
  providers: [PortalEventListener],
})
export class PortalModule {
  static forRoot(options: { queue: Queue }): DynamicModule {
    return {
      module: PortalModule,
      imports: [
        CqrsModule.forRoot({
          queue: options.queue,
          queryServices: [UserQueryCqrs],
          commandServices: [UserCommandCqrs],
        }),
      ],
    }
  }
}
