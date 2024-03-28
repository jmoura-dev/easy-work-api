import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { DevelopersRepository } from '@/domain/easy-work/application/repositories/developers-repository'

interface GetNotificationsUseCaseRequest {
  recipientId: string
}

type GetNotificationsUseCaseResponse = Either<
  NotAllowedError,
  {
    notifications: Notification[]
  }
>

@Injectable()
export class GetNotificationsUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private developersRepository: DevelopersRepository,
  ) {}

  async execute({
    recipientId,
  }: GetNotificationsUseCaseRequest): Promise<GetNotificationsUseCaseResponse> {
    const developer = await this.developersRepository.findByUserId(recipientId)

    if (!developer) {
      return left(new NotAllowedError())
    }

    const notifications =
      await this.notificationsRepository.findManyByDeveloperId(
        developer.id.toString(),
      )

    return right({
      notifications,
    })
  }
}
