import { Injectable } from '@nestjs/common'
import { EventBus } from '../../../core/cqrs/bus/event.bus'
import { UserEvent, UserQuery } from '../../user'

export type NotificationEvent = {
  $type: 'Notification.Sent'
}

@Injectable()
export class NotificationEventListener {
  constructor(
    private eventBus: EventBus<UserEvent | NotificationEvent>,
    private userQuery: UserQuery,
  ) {}

  onModuleInit() {
    this.eventBus.subscribe(async x => {
      switch (x.$type) {
        case 'User.LoggedIn': {
          console.log('Notification: User logged in', x.id)

          this.eventBus.publish({
            $type: 'Notification.Sent',
          })
        }

        case 'User.Registered': {
          const user = await this.userQuery.byId({ id: x.id })

          console.log(
            'Notification: User registered - ',
            user?.fullname ?? 'NOT FOUND',
          )

          this.eventBus.publish({
            $type: 'Notification.Sent',
          })
        }
      }
    })
  }
}
