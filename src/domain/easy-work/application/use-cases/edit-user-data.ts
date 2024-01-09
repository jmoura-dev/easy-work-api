import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { HashGenerator } from '../cryptography/hash-generator'
import { HashComparer } from '../cryptography/hash-comparer'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface EditUserDataUseCaseRequest {
  userId: string
  name?: string
  oldPassword?: string
  newPassword?: string
  avatarId?: string
  about?: string
}

type EditUserDataUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError,
  {
    user: User
  }
>

@Injectable()
export class EditUserDataUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    userId,
    name,
    oldPassword,
    newPassword,
    avatarId,
    about,
  }: EditUserDataUseCaseRequest): Promise<EditUserDataUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    let doesPasswordsMatch = true

    if (oldPassword) {
      doesPasswordsMatch = await this.hashComparer.compare(
        oldPassword,
        user.password,
      )
    }

    if (!doesPasswordsMatch) {
      return left(new WrongCredentialsError())
    }

    if (newPassword && !oldPassword) {
      return left(new WrongCredentialsError())
    }

    user.name = name ?? user.name
    user.password = newPassword
      ? await this.hashGenerator.hash(newPassword)
      : user.password
    user.avatarId = avatarId ? new UniqueEntityID(avatarId) : user.avatarId
    user.about = about ?? user.about

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
