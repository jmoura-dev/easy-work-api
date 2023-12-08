import { UseCaseError } from '@/core/errors/use-case-error'

export class EmailAlreadyExists extends Error implements UseCaseError {
  constructor(email: string) {
    super(`Email address ${email} already exists in the database.`)
  }
}
