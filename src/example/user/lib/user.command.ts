import { Injectable } from '@nestjs/common'
import { EventBus } from '../../../core/cqrs/bus/event.bus'
import { CommandHandler } from '../../../core/cqrs/decorators/commandHandler.decorator'
import { UserCommandCqrs } from '../shared/user.command.shared'
import { UserDb } from './models/user.db'
import { UserEvent } from './user.event'
import { UserRepo } from './user.repo'

@CommandHandler({ publicApi: UserCommandCqrs })
@Injectable()
export class UserCommand implements UserCommandCqrs {
  constructor(
    public repo: UserRepo,
    public eventBus: EventBus<UserEvent>,
  ) {}

  async login(props: { username: string; password: string }, meta?) {
    const { username, password } = props
    const user = this.repo.data.find(x => x.username === username)
    if (!user) {
      return null
    }

    const isSuccess = username === password
    if (!isSuccess) {
      return null
    }

    this.eventBus.publish({
      __type: 'User.LoggedIn',
      id: user.id,
    })

    return user.id
  }

  async register(
    props: { firstName: string; lastName: string },
    meta?,
  ) {
    const { firstName, lastName } = props

    const user: UserDb = {
      id: Date.now().toString(),
      username: firstName.toLowerCase(),
      password: firstName.toLowerCase(),
      fullname: firstName + ' ' + lastName,
    }

    this.repo.data.push(user)

    this.eventBus.publish({
      __type: 'User.Registered',
      id: user.id,
    })

    return user.id
  }
}
