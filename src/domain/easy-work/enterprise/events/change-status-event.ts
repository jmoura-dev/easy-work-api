import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Candidature } from '../entities/candidature'

export class ChangeStatusEvent implements DomainEvent {
  public ocurredAt: Date
  public status: string
  public candidature: Candidature

  constructor(candidature: Candidature) {
    this.ocurredAt = new Date()
    this.candidature = candidature
    this.status = candidature.status
  }

  getAggregateId(): UniqueEntityID {
    return this.candidature.id
  }
}
