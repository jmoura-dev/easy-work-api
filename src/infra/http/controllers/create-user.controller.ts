import { CreateUserUseCase } from '@/domain/easy-work/application/use-cases/create-user'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EmailAlreadyExists } from '@/domain/easy-work/application/use-cases/errors/email-already-exists-error'
import { Public } from '@/infra/auth/public'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatarId: z.string().uuid().optional(),
  about: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema)

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/users')
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @Public()
  async create(@Body(bodyValidationPipe) body: CreateUserBodySchema) {
    const { name, email, password, avatarId, about } = body

    const result = await this.createUserUseCase.execute({
      name,
      email,
      password,
      avatarId,
      about,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmailAlreadyExists:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
