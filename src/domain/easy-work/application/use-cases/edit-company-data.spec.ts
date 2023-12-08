import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeCompany } from 'test/factories/make-company'
import { EditCompanyDataUseCase } from './edit-company-data'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: EditCompanyDataUseCase

describe('Edit company data Use case', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    sut = new EditCompanyDataUseCase(inMemoryCompaniesRepository)
  })

  it('should be able update company data', async () => {
    const company = makeCompany({
      name: 'Javascript Corporation',
      email: 'javascript@example.com',
      password: '123456',
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      name: 'Nodejs Corporation',
      email: 'javascript@example.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompaniesRepository.items[0].name).toEqual(
      'Nodejs Corporation',
    )
  })

  it('should not be able to update company data with invalid email', async () => {
    const company = makeCompany({
      name: 'Javascript Corporation',
      email: 'javascript@example.com',
      password: '123456',
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      name: 'Nodejs Corporation',
      email: 'invalid@email.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
