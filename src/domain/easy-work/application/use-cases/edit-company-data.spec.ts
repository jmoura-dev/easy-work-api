import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeCompany } from 'test/factories/make-company'
import { EditCompanyDataUseCase } from './edit-company-data'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeUser } from 'test/factories/make-user'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: EditCompanyDataUseCase

describe('Edit company data Use case', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    sut = new EditCompanyDataUseCase(inMemoryCompaniesRepository)
  })

  it('should be able update company data', async () => {
    const user = makeUser()
    const company = makeCompany({
      userId: user.id,
      cnpj: '12345678900012',
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      userId: company.userId.toString(),
      cnpj: '98765432100012',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompaniesRepository.items[0].cnpj).toEqual('98765432100012')
  })

  it('should not be able to update company data with invalid id', async () => {
    const user = makeUser()
    const company = makeCompany({
      userId: user.id,
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      userId: 'invalid-company-id',
      site_url: 'new_site.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
