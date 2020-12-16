import { Abstract, Type } from '@nestjs/common'
import { CqrsBusType } from '../cqrs.tokens'

export interface IHandlerMetadata {
  publicApi: Type<any> | Abstract<any>
}

export interface IHandlerPrivateMetadata extends IHandlerMetadata {
  busType: CqrsBusType
}
