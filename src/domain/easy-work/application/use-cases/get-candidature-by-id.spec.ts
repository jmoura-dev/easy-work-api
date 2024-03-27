import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetCandidatureByIdUseCase } from './get-candidature-by-id'
import { InMemoryCandidaturesRepository } from 'test/repositories/in-memory-candidatures-repository'
import { makeCandidature } from 'test/factories/make-candidature'

let inMemoryCandidaturesRepository: InMemoryCandidaturesRepository

let sut: GetCandidatureByIdUseCase

describe('Get candidature by id', () => {
  beforeEach(() => {
    inMemoryCandidaturesRepository = new InMemoryCandidaturesRepository()
    sut = new GetCandidatureByIdUseCase(inMemoryCandidaturesRepository)
  })

  it('should be able to get candidature by id', async () => {
    const candidature = makeCandidature({
      status: 'Aguardando atualizações',
    })

    inMemoryCandidaturesRepository.items.push(candidature)

    const result = await sut.execute({
      candidatureId: candidature.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      candidature: expect.objectContaining({
        status: 'Aguardando atualizações',
      }),
    })
  })

  it('should not be able to get candidature with invalid-ID', async () => {
    const candidature = makeCandidature({
      status: 'Aguardando atualizações',
    })

    inMemoryCandidaturesRepository.items.push(candidature)

    const result = await sut.execute({
      candidatureId: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
