import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CompanyWithDetailsProps {
  companyId: UniqueEntityID
  avatarUrl: string | null
  userName: string
  city: string | null
  state: string | null
  site_url: string | null
  about: string | null
}

export class CompanyWithDetails extends ValueObject<CompanyWithDetailsProps> {
  get companyId() {
    return this.props.companyId
  }

  get avatarUrl() {
    return this.props.avatarUrl
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

  get about() {
    return this.props.about
  }

  static create(props: CompanyWithDetailsProps) {
    return new CompanyWithDetails(props)
  }
}
