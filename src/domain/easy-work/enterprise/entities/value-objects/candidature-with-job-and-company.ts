import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CandidatureWithJobAndCompanyProps {
  candidatureId: UniqueEntityID
  jobTitle: string
  companyName: string
  status: string
  createdAt: Date
  updatedAt: Date | null
}

export class CandidatureWithJobAndCompany extends ValueObject<CandidatureWithJobAndCompanyProps> {
  get candidatureId() {
    return this.props.candidatureId
  }

  get jobTitle() {
    return this.props.jobTitle
  }

  get companyName() {
    return this.props.companyName
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: CandidatureWithJobAndCompanyProps) {
    return new CandidatureWithJobAndCompany(props)
  }
}
