import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { ChangeStatusEvent } from '@/domain/easy-work/enterprise/events/change-status-event'
import { DevelopersRepository } from '@/domain/easy-work/application/repositories/developers-repository'
import { Injectable } from '@nestjs/common'
import { JobsRepository } from '@/domain/easy-work/application/repositories/jobs-repository'

@Injectable()
export class OnChangeStatus implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private developersRepository: DevelopersRepository,
    private jobsRepositor: JobsRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendChangeStatusNotification.bind(this),
      ChangeStatusEvent.name,
    )
  }

  private async sendChangeStatusNotification({
    candidature,
    status,
  }: ChangeStatusEvent) {
    const developer = await this.developersRepository.findById(
      candidature.developerId.toString(),
    )

    const job = await this.jobsRepositor.findById(candidature.jobId.toString())

    if (!job) {
      throw new Error(`Job with id ${candidature.jobId} not found.`)
    }

    if (developer) {
      await this.sendNotification.execute({
        recipientId: developer.id.toString(),
        title: `Candidatura "${job.title.toUpperCase()}" tem um novo status.`,
        content: `O novo status da candidatura é de "${status}"`,
      })
    }
  }
}
