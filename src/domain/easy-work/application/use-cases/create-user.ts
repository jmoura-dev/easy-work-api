import { Either, left, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { User } from '../../enterprise/entities/user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EmailAlreadyExists } from './errors/email-already-exists-error'
import { HashGenerator } from '../cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  avatarId?: string
  about?: string
}

type CreateUserUseCaseResponse = Either<EmailAlreadyExists, null>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    avatarId,
    about,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const doesUserAlreadyExists = await this.usersRepository.findByEmail(email)

    if (doesUserAlreadyExists) {
      return left(new EmailAlreadyExists(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      avatarId: avatarId ? new UniqueEntityID(avatarId) : null,
      about,
    })

    await this.usersRepository.create(user)

    return right(null)
  }
}
