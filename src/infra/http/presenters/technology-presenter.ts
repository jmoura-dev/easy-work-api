import { Technology } from '@/domain/easy-work/enterprise/entities/technology'

export class TechnologyPresenter {
  static toHttp(technology: Technology) {
    return {
      id: technology.id.toString(),
      name: technology.name,
    }
  }
}
