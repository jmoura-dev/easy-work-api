import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAvatarTypeError } from './errors/invalid-avatar-type-error'
import { Avatar } from '../../enterprise/entities/avatar'
import { AvataresRepository } from '../repositories/avatares-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAvatarUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAvatarUseCaseResponse = Either<
  InvalidAvatarTypeError,
  {
    avatar: Avatar
  }
>

@Injectable()
export class UploadAndCreateAvatarUseCase {
  constructor(
    private avataresRepository: AvataresRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAvatarUseCaseRequest): Promise<UploadAndCreateAvatarUseCaseResponse> {
    if (!/^(image\/(jpeg|jpg)|image\/png|application\/pdf)$/.test(fileType)) {
      return left(new InvalidAvatarTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const avatar = Avatar.create({
      title: fileName,
      url,
    })

    await this.avataresRepository.create(avatar)

    return right({
      avatar,
    })
  }
}
