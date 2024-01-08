import { InMemoryAvataresRepository } from 'test/repositories/in-memory-avatares-repository'
import { UploadAndCreateAvatarUseCase } from './upload-and-create-avatar'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAvatarTypeError } from './errors/invalid-avatar-type-error'

let inMemoryAvataresRepository: InMemoryAvataresRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAvatarUseCase

describe('Upload and create avatar', () => {
  beforeEach(() => {
    inMemoryAvataresRepository = new InMemoryAvataresRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAvatarUseCase(
      inMemoryAvataresRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an avatar', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      avatar: inMemoryAvataresRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an avatar with invalid file type ', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAvatarTypeError)
  })
})
