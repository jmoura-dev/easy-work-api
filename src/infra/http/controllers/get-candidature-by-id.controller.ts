import { GetCandidatureByIdUseCase } from '@/domain/easy-work/application/use-cases/get-candidature-by-id'
import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { CandidaturePresenter } from '../presenters/candidature-presenter'

@Controller('/candidatures/:candidature_id/details')
export class GetCandidatureByIdController {
  constructor(private getCandidatureById: GetCandidatureByIdUseCase) {}

  @Get()
  async handle(@Param('candidature_id') candidatureId: string) {
    const result = await this.getCandidatureById.execute({
      candidatureId,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }

    const { candidature: candidatureProps } = result.value

    const candidature = CandidaturePresenter.toHttp(candidatureProps)

    return {
      candidature,
    }
  }
}
