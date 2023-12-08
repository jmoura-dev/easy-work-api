import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { CreateTechnologyUseCase } from './create-technology'
import { makeTechnology } from 'test/factories/make-technology'
import { TechnologyNameAlreadyExists } from './errors/technology-name-already-exists-error'

let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository
let sut: CreateTechnologyUseCase

describe('Create technology Use case', () => {
  beforeEach(() => {
    inMemoryTechnologiesRepository = new InMemoryTechnologiesRepository()
    sut = new CreateTechnologyUseCase(inMemoryTechnologiesRepository)
  })

  it('should be able to create a new technology', async () => {
    const result = await sut.execute({
      name: 'Docker',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTechnologiesRepository.items[0]).toMatchObject({
      name: 'Docker',
    })
  })

  it('should not be able to create a new technology with same name', async () => {
    const technology = makeTechnology({ name: 'Docker' })

    inMemoryTechnologiesRepository.create(technology)

    const result = await sut.execute({
      name: 'Docker',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TechnologyNameAlreadyExists)
  })
})
