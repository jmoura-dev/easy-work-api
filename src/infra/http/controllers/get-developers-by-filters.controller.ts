import { GetAllDevelopersUseCase } from '@/domain/easy-work/application/use-cases/get-all-developers'
import { Body, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeveloperWithTechnologiesPresenter } from '../presenters/developer-with-technologies-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const createBodySchema = z.object({
  name: z.string().optional(),
  occupation_area: z.string().optional(),
  techs: z.array(z.string()),
})

const pageZodQueryParamPipe = new ZodValidationPipe(pageQueryParamSchema)
const createZodBodyPipe = new ZodValidationPipe(createBodySchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type PageRequestBodySchema = z.infer<typeof createBodySchema>

@Controller('/developers/list')
export class GetDevelopersByQueriesController {
  constructor(private getAllDevelopers: GetAllDevelopersUseCase) {}

  @Get()
  async handle(
    @Query('page', pageZodQueryParamPipe) page: PageQueryParamSchema,
    @Body(createZodBodyPipe) body: PageRequestBodySchema,
  ) {
    const { name, occupation_area, techs } = body

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
