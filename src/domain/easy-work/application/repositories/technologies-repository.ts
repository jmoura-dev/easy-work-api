import { Technology } from '../../enterprise/entities/technology'

export interface TechnologiesRepository {
  create(technology: Technology): Promise<void>
  findByName(name: string): Promise<Technology | null>
  findById(id: string): Promise<Technology | null>
}
