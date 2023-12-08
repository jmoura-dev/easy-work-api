import { UseCaseError } from '@/core/errors/use-case-error'

export class TechnologyNameAlreadyExists extends Error implements UseCaseError {
  constructor(name: string) {
    super(`This technology of ${name} already exists in the database.`)
  }
}
