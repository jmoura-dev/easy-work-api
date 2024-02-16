import { UserWithRole } from '@/domain/easy-work/enterprise/entities/value-objects/user-with-role'

export class UserWithRolePresenter {
  static toHttp(user: UserWithRole) {
    return {
      userId: user.userId.toString(),
      name: user.name,
      email: user.email,
      about: user.about,
      developerId: user.developerId ? user.developerId.toString() : null,
      companyId: user.companyId ? user.companyId.toString() : null,
    }
  }
}
