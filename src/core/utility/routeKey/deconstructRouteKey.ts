import { CqrsBusType } from '../../cqrs'
import { IRouteKeyParts } from './types'

export function deconstructRouteKey(
  messageId: string,
): IRouteKeyParts {
  const [busType, serviceName, functionName] = messageId.split('.')

  return {
    busType: busType as CqrsBusType,
    serviceName,
    functionName,
  }
}
