import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface JobWithCompanyProps {
  jobId: UniqueEntityID
  companyName: string
  title: string
  description: string
  workMode: string
  workSchedule: string
  remuneration: number
  hoursPerWeek: number
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

  get workMode() {
    return this.props.workMode
  }

  get workSchedule() {
    return this.props.workSchedule
  }

  get remuneration() {
    return this.props.remuneration
  }

  get hoursPerWeek() {
    return this.props.hoursPerWeek
  }

  get created_at() {
    return this.props.created_at
  }

  static create(props: JobWithCompanyProps) {
    return new JobWithCompany(props)
  }
}
