import { UseCaseError } from '@/core/errors/use-case-error'

export class TechnologyNotFound extends Error implements UseCaseError {
  constructor(name: string) {
    super(`This technology of name:${name} not exists in the database.`)
  }
}
