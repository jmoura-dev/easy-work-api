import { UseCaseError } from '@/core/errors/use-case-error'

export class CandidatureAlreadyExists extends Error implements UseCaseError {
  constructor() {
    super('Você já se candidatou para essa vaga!')
  }
}
