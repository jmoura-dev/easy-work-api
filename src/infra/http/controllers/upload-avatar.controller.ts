import { InvalidAvatarTypeError } from '@/domain/easy-work/application/use-cases/errors/invalid-avatar-type-error'
import { UploadAndCreateAvatarUseCase } from '@/domain/easy-work/application/use-cases/upload-and-create-avatar'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/avatar')
export class UploadAvatarController {
  constructor(private uploadAndCreateAvatar: UploadAndCreateAvatarUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2megabytes
          }),
          new FileTypeValidator({
            fileType: '.(jpg|png|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAvatar.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAvatarTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { avatar } = result.value

    return {
      avatarId: avatar.id.toString(),
    }
  }
}
