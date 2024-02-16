import {
  User as PrismaUser,
  Developer as PrismaDeveloper,
  Company as PrismaCompany,
} from '@prisma/client'
import { UserWithRole } from '@/domain/easy-work/enterprise/entities/value-objects/user-with-role'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaUserWithRole = PrismaUser & {
  developer: PrismaDeveloper | null
  company: PrismaCompany | null
}

export class PrismaUserWithRoleMapper {
  static toDomain(raw: PrismaUserWithRole): UserWithRole {
    return UserWithRole.create({
      userId: new UniqueEntityID(raw.id),
      name: raw.name,
      email: raw.email,
      password: raw.password,
      avatarId: raw.avatarId ? new UniqueEntityID(raw.avatarId) : null,
      about: raw.about,
      developerId: raw.developer ? new UniqueEntityID(raw.developer.id) : null,
      companyId: raw.company ? new UniqueEntityID(raw.company.id) : null,
    })
  }
}
