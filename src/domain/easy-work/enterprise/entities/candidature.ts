import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ChangeStatusEvent } from '../events/change-status-event'

export interface CandidatureProps {
  developerId: UniqueEntityID
  jobId: UniqueEntityID
  status: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Candidature extends AggregateRoot<CandidatureProps> {
  get developerId() {
    return this.props.developerId
  }

  get jobId() {
    return this.props.jobId
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
    this.touch()

    this.addDomainEvent(new ChangeStatusEvent(this))
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CandidatureProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const candidature = new Candidature(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return candidature
  }
}
