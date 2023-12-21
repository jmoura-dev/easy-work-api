import { Developer } from '../../enterprise/entities/user-developer'

export abstract class DevelopersRepository {
  abstract create(developer: Developer): Promise<void>
  abstract findById(id: string): Promise<Developer | null>
  abstract save(developer: Developer): Promise<void>
}
