import { GetAllDevelopersUseCase } from '@/domain/easy-work/application/use-cases/get-all-developers'
import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeveloperWithTechnologiesPresenter } from '../presenters/developer-with-technologies-presenter'
import { Public } from '@/infra/auth/public'

const createQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  name: z.string().optional(),
  occupation_area: z.string().optional(),
  techs: z.string().optional().default(''),
})

const createQuerySchemaPipe = new ZodValidationPipe(createQuerySchema)

type CreateQuerySchema = z.infer<typeof createQuerySchema>

@Controller('/developers/list')
@Public()
export class GetDevelopersByQueriesController {
  constructor(private getAllDevelopers: GetAllDevelopersUseCase) {}

  @Get()
  async handle(@Query(createQuerySchemaPipe) query: CreateQuerySchema) {
    const { page, name, occupation_area, techs } = query
    console.log(page, name, occupation_area, techs)

    const result = await this.getAllDevelopers.execute({
      name,
      occupation_area,
      techs,
      page,
    })

    const developers = result.developers

    const developersWithTechs = developers.map((developer) =>
      DeveloperWithTechnologiesPresenter.toHTTP(developer),
    )

    return {
      developersWithTechs,
    }
  }
}
