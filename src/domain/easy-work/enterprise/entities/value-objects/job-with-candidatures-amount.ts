import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface JobWithCandidaturesAmountProps {
  jobId: UniqueEntityID
  title: string
  description: string
  workMode: string
  workSchedule: string
  remuneration: number
  hoursPerWeek: number
  createdAt: Date
  amountCandidatures: number
  candidatures: {
    userId: string
    userName: string
    occupation_area: string
  }[]
}

export class JobWithCandidaturesAmount extends ValueObject<JobWithCandidaturesAmountProps> {
  get jobId() {
    return this.props.jobId
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

  get createdAt() {
    return this.props.createdAt
  }

  get amountCandidatures() {
    return this.props.amountCandidatures
  }

  get candidatures() {
    return this.props.candidatures
  }

  static create(props: JobWithCandidaturesAmountProps) {
    return new JobWithCandidaturesAmount(props)
  }
}
