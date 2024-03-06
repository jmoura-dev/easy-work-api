import { GetDeveloperDetailsUseCase } from '@/domain/easy-work/application/use-cases/get-developer-details'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Get, NotAcceptableException } from '@nestjs/common'
import { DeveloperWithTechnologiesPresenter } from '../presenters/developer-with-technologies-presenter'

@Controller('/developers/:user_id/details')
export class GetDeveloperDetailsController {
  constructor(private getDeveloperDetails: GetDeveloperDetailsUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

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
