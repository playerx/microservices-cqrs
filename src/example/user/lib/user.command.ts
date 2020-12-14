import { Injectable } from '@nestjs/common'
import { EventBus } from '../../../core/cqrs/bus/event.bus'
import { UserDb } from './models/user.db'
import { UserEvent } from './user.event'
import { UserRepo } from './user.repo'

@Injectable()
export class UserCommand {
  constructor(
    public repo: UserRepo,
    public eventBus: EventBus<UserEvent>,
  ) {}

  async login(props: { username: string; password: string }) {
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
      $type: 'User.LoggedIn',
      id: user.id,
    })

    return user.id
  }

  async register(props: { firstName: string; lastName: string }) {
    const { firstName, lastName } = props

    const user: UserDb = {
      id: Date.now().toString(),
      username: firstName.toLowerCase(),
      password: firstName.toLowerCase(),
      fullname: firstName + ' ' + lastName,
    }

    this.repo.data.push(user)

    this.eventBus.publish({
      $type: 'User.Registered',
      id: user.id,
    })

    return user.id
  }
}
