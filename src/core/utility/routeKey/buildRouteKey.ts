import { IRouteKeyParts } from './types'

export function buildRouteKey(args: IRouteKeyParts): string {
  return `${args.busType}.${args.serviceName}.${args.functionName}`
}
