import { GetDeveloperDetailsUseCase } from '@/domain/easy-work/application/use-cases/get-developer-details'
import { Controller, Get, NotAcceptableException, Param } from '@nestjs/common'
import { DeveloperWithTechnologiesPresenter } from '../presenters/developer-with-technologies-presenter'

@Controller('/developers/:user_id/details')
export class GetDeveloperDetailsController {
  constructor(private getDeveloperDetails: GetDeveloperDetailsUseCase) {}

  @Get()
  async handle(@Param('user_id') userId: string) {
    const result = await this.getDeveloperDetails.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new NotAcceptableException()
    }

    const developer = result.value.developerWithDetails

    const developerWithDetails =
      DeveloperWithTechnologiesPresenter.toHTTP(developer)

    return {
      developerWithDetails,
    }
  }
}
