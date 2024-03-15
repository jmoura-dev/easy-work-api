import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { makeTechnology } from 'test/factories/make-technology'
import { GetAllTechnologiesUseCase } from './get-all-technologies'

let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository
let sut: GetAllTechnologiesUseCase

describe('Get all technologies Use Case', () => {
  beforeEach(() => {
    inMemoryTechnologiesRepository = new InMemoryTechnologiesRepository()
    sut = new GetAllTechnologiesUseCase(inMemoryTechnologiesRepository)
  })

  it('should be able to fetch all technologies', async () => {
    const dockerTechnology = makeTechnology({ name: 'Docker' })
    const typescriptTechnology = makeTechnology({ name: 'Typescript' })
    const javaTechnology = makeTechnology({ name: 'Java' })

    inMemoryTechnologiesRepository.items.push(dockerTechnology)
    inMemoryTechnologiesRepository.items.push(typescriptTechnology)
    inMemoryTechnologiesRepository.items.push(javaTechnology)

    const result = await sut.execute()

    expect(result.technologies.length).toBe(3)
    expect(result.technologies).toEqual([
      expect.objectContaining({ name: 'Docker' }),
      expect.objectContaining({ name: 'Typescript' }),
      expect.objectContaining({ name: 'Java' }),
    ])
  })
})
