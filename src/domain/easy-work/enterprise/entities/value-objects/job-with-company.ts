import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface JobWithCompanyProps {
  jobId: UniqueEntityID
  companyName: string
  title: string
  description: string
  created_at: Date
}

export class JobWithCompany extends ValueObject<JobWithCompanyProps> {
  get jobId() {
    return this.props.jobId
  }

  get companyName() {
    return this.props.companyName
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get created_at() {
    return this.props.created_at
  }

  static create(props: JobWithCompanyProps) {
    return new JobWithCompany(props)
  }
}
