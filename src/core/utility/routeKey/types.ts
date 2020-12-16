import { CqrsBusType } from '../../cqrs'

export interface IRouteKeyParts {
  busType: CqrsBusType
  serviceName: string
  functionName: string
}
