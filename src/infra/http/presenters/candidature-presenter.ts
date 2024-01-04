import { Candidature } from '@/domain/easy-work/enterprise/entities/candidature'

export class CandidaturePresenter {
  static toHttp(candidature: Candidature) {
    return {
      id: candidature.id.toString(),
      status: candidature.status,
      createdAt: candidature.createdAt,
      updatedAt: candidature.updatedAt,
    }
  }
}
