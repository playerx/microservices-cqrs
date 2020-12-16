import { CqrsBusType } from '../../../cqrs'
import { buildRouteKey } from '../buildRouteKey'
import { deconstructRouteKey } from '../deconstructRouteKey'
import { IRouteKeyParts } from '../types'

describe('routeKey logic', () => {
  it('should encode and decode the same messageId', () => {
    const input: IRouteKeyParts = {
      busType: CqrsBusType.Command,
      serviceName: 'testService',
      functionName: 'testFunction',
    }

    const id = buildRouteKey(input)
    const deconstructed = deconstructRouteKey(id)

    expect(input).toMatchObject(deconstructed)

    const secondId = buildRouteKey(deconstructed)
    expect(id).toMatch(secondId)
  })
})
