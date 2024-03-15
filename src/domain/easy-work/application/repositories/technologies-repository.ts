import { Technology } from '../../enterprise/entities/technology'

export abstract class TechnologiesRepository {
  abstract create(technology: Technology): Promise<void>
  abstract findByName(name: string): Promise<Technology | null>
  abstract findById(id: string): Promise<Technology | null>
  abstract findMany(): Promise<Technology[]>
}
