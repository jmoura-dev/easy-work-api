import { UsersRepository } from '@/domain/easy-work/application/repositories/users-repository'
import { User } from '@/domain/easy-work/enterprise/entities/user'
import { UserWithRole } from '@/domain/easy-work/enterprise/entities/value-objects/user-with-role'
import { InMemoryDevelopersRepository } from './in-memory-developers-repository'
import { InMemoryCompaniesRepository } from './in-memory-companies-repository'

export class InMemoryUsersRepository implements UsersRepository {
  private inMemoryDevelopersRepository: InMemoryDevelopersRepository
  private inMemoryCompaniesRepository: InMemoryCompaniesRepository

  constructor(
    inMemoryDevelopersRepository: InMemoryDevelopersRepository,
    inMemoryCompaniesRepository: InMemoryCompaniesRepository,
  ) {
    this.inMemoryDevelopersRepository = inMemoryDevelopersRepository
    this.inMemoryCompaniesRepository = inMemoryCompaniesRepository
  }

  public items: User[] = []

  async create(user: User): Promise<User> {
    this.items.push(user)

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<UserWithRole | null> {
    const user = this.items.find((item) => item.email.toString() === email)

    if (!user) {
      return null
    }

    const developer = this.inMemoryDevelopersRepository.items.find((item) =>
      item.id.equals(user.id),
    )

    const company = this.inMemoryCompaniesRepository.items.find(
      (item) => item.id === user.id,
    )

    const userWithRole = UserWithRole.create({
      userId: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      about: user.about,
      avatarId: user.avatarId,
      developerId: developer ? developer.id : null,
      companyId: company ? company.id : null,
    })

    return userWithRole
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[itemIndex] = user
  }
}
