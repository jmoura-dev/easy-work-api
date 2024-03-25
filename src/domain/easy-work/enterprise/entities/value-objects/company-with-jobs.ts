import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CompanyWithJobsProps {
  companyId: UniqueEntityID
  userName: string
  city: string | null
  state: string | null
  site_url: string | null
  title: string
  description: string
  createdAt: Date
}

export class CompanyWithJobs extends ValueObject<CompanyWithJobsProps> {
  get companyId() {
    return this.props.companyId
  }

  get userName() {
    return this.props.userName
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get site_url() {
    return this.props.site_url
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: CompanyWithJobsProps) {
    return new CompanyWithJobs(props)
  }
}
