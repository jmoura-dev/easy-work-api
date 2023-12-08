import { UseCaseError } from '@/core/errors/use-case-error'

export class TechnologyAlreadyAddedInTheDeveloper
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`This technology already belongs to this developer`)
  }
}
