import { InMemoryCandidaturesRepository } from 'test/repositories/in-memory-candidatures-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { UpdateStatusCandidatureUseCase } from './update-status-candidature'
import { makeCompany } from 'test/factories/make-company'
import { makeCandidature } from 'test/factories/make-candidature'
import { makeUser } from 'test/factories/make-user'

let inMemoryCandidaturesRepository: InMemoryCandidaturesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: UpdateStatusCandidatureUseCase

describe('Update status candidature Use case', () => {
  beforeEach(() => {
    inMemoryCandidaturesRepository = new InMemoryCandidaturesRepository()
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()

    sut = new UpdateStatusCandidatureUseCase(
      inMemoryCandidaturesRepository,
      inMemoryCompaniesRepository,
    )
  })

  it('should be able to update status', async () => {
    const user = makeUser()

    const company = makeCompany({
      userId: user.id,
    })
    const candidature = makeCandidature({
      status: 'New candidature status',
    })

    const candidatureId = candidature.id.toString()

    inMemoryCompaniesRepository.create(company)
    inMemoryCandidaturesRepository.create(candidature)

    const result = await sut.execute({
      userId: user.id.toString(),
      candidatureId,
      status: 'Analisando perfil',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      candidature: expect.objectContaining({ status: 'Analisando perfil' }),
    })
  })
})
