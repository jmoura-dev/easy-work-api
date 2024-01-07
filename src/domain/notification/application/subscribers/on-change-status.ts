import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { ChangeStatusEvent } from '@/domain/easy-work/enterprise/events/change-status-event'
import { DevelopersRepository } from '@/domain/easy-work/application/repositories/developers-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnChangeStatus implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private developersRepository: DevelopersRepository,
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

    if (developer) {
      await this.sendNotification.execute({
        recipientId: developer.id.toString(),
        title: 'Status alterado',
        content: `O novo status da encomenda é de "${status}"`,
      })
    }
  }
}
