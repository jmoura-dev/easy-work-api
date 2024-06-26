import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.create({
      data,
    })
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    })

    if (!notification) {
      return null
    }

    return PrismaNotificationMapper.toDomain(notification)
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findManyByDeveloperId(id: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        recipientId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return notifications.map((notification) =>
      PrismaNotificationMapper.toDomain(notification),
    )
  }
}
