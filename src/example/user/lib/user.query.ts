import { Injectable } from '@nestjs/common'
import { UserRepo } from './user.repo'

@Injectable()
export class UserQuery {
  constructor(public repo: UserRepo) {}

  async byId(props: { id: string }) {
    const { id } = props

    return this.repo.data.find(x => x.id === id) ?? null
  }

  async list(props: {}) {
    return this.repo.data
  }
}
