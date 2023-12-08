import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { CreateCompanyUseCase } from './create-company'
import { makeCompany } from 'test/factories/make-company'
import { EmailAlreadyExists } from './errors/email-already-exists-error'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: CreateCompanyUseCase

describe('Create company Use case', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    sut = new CreateCompanyUseCase(inMemoryCompaniesRepository)
  })

  it('should be able to create a new company', async () => {
    const company = makeCompany({
      name: 'Javascript company',
      email: 'company@example.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: company.name,
      email: company.email,
      password: company.password,
      cnpj: company.cnpj,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompaniesRepository.items[0]).toMatchObject({
      name: 'Javascript company',
      email: 'company@example.com',
    })
  })

  it('should not be able to create a new company when email already exists', async () => {
    const company = makeCompany({
      name: 'Javascript company',
      email: 'company@example.com',
      password: '123456',
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      name: company.name,
      email: company.email,
      password: company.password,
      cnpj: company.cnpj,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExists)
  })
})
