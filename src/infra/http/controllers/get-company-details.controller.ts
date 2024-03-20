import { GetCompanyDetailsUseCase } from '@/domain/easy-work/application/use-cases/get-company-details'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Get, NotAcceptableException } from '@nestjs/common'
import { CompanyWithDetailsPresenter } from '../presenters/company-with-details-presenter'

@Controller('/companies/:user_id/details')
export class GetCompanyDetailsController {
  constructor(private getCompanyDetails: GetCompanyDetailsUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

    const result = await this.getCompanyDetails.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new NotAcceptableException()
    }

    const company = result.value.companyWithDetails

    const companyWithDetails = CompanyWithDetailsPresenter.toHTTP(company)

    return {
      companyWithDetails,
    }
  }
}
