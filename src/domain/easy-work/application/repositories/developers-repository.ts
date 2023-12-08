import { Developer } from '../../enterprise/entities/developer'

export interface DevelopersRepository {
  create(developer: Developer): Promise<void>
  findById(id: string): Promise<Developer | null>
  findByEmail(email: string): Promise<Developer | null>
  save(developer: Developer): Promise<void>
}
