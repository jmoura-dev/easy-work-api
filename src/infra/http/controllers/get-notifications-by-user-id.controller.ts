import { GetNotificationsUseCase } from '@/domain/notification/application/use-cases/get-notifications-by-recipient-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Get, NotFoundException } from '@nestjs/common'
import { NotificationPresenter } from '../presenters/notification-presenter'

@Controller('/notifications/:user_id')
export class GetNotificationsByUserIdController {
  constructor(private getNotifications: GetNotificationsUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

    const result = await this.getNotifications.execute({
      recipientId: userId,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }

    const { notifications: NotificationsArray } = result.value

    const notifications = NotificationsArray.map((notification) =>
      NotificationPresenter.toHttp(notification),
    )

    return {
      notifications,
    }
  }
}
