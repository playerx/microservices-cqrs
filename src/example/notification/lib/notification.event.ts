import { Injectable } from '@nestjs/common'
import { EventBus } from '../../../core/cqrs/bus/event.bus'
import { UserEvent, UserQuery } from '../../user'
import { UserQueryCqrs } from '../../user/shared/user.query.shared'

export type NotificationEvent = {
  __type: 'Notification.Sent'
}

@Injectable()
export class NotificationEventListener {
  constructor(
    private eventBus: EventBus<UserEvent | NotificationEvent>,
    private userQuery: UserQueryCqrs,
  ) {}

  onModuleInit() {
    this.eventBus.subscribe(async (route, x) => {
      switch (x.__type) {
        case 'User.LoggedIn': {
          console.log('Notification: User logged in', x.id)

          this.eventBus.publish({
            __type: 'Notification.Sent',
          })
        }

        case 'User.Registered': {
          const user = await this.userQuery.byId({ id: x.id })

          console.log(
            'Notification: User registered - ',
            user?.fullname ?? 'NOT FOUND',
          )

          this.eventBus.publish({
            __type: 'Notification.Sent',
          })
        }
      }
    })
  }
}
