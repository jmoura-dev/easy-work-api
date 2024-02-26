import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface JobProps {
  companyId: UniqueEntityID
  title: string
  description: string
  workMode: string
  workSchedule: string
  remuneration: number
  hoursPerWeek: number
  created_at: Date
}

export class Job extends Entity<JobProps> {
  get companyId() {
    return this.props.companyId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
  }

  get workMode() {
    return this.props.workMode
  }

  set workMode(workMode: string) {
    this.props.workMode = workMode
  }

  get workSchedule() {
    return this.props.workSchedule
  }

  set workSchedule(workSchedule: string) {
    this.props.workSchedule = workSchedule
  }

  get remuneration() {
    return this.props.remuneration
  }

  set remuneration(remuneration: number) {
    this.props.remuneration = remuneration
  }

  get hoursPerWeek() {
    return this.props.hoursPerWeek
  }

  set hoursPerWeek(hoursPerWeek: number) {
    this.props.hoursPerWeek = hoursPerWeek
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get created_at() {
    return this.props.created_at
  }

  static create(props: Optional<JobProps, 'created_at'>, id?: UniqueEntityID) {
    const job = new Job(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    )

    return job
  }
}
