import { DeveloperWithTechnologies } from '@/domain/easy-work/enterprise/entities/value-objects/developer-with-technologies'

export class DeveloperWithTechnologiesPresenter {
  static toHTTP(developerWithTechnologies: DeveloperWithTechnologies) {
    return {
      developerId: developerWithTechnologies.developerId.toString(),
      userName: developerWithTechnologies.userName.toLowerCase(),
      occupation_area: developerWithTechnologies.occupation_area,
      price_per_hour: developerWithTechnologies.price_per_hour,
      available_for_contract: developerWithTechnologies.available_for_contract,
      about: developerWithTechnologies.about,
      techs: developerWithTechnologies.techs.map((tech) => {
        return {
          id: tech.id.toString(),
          name: tech.name,
        }
      }),
    }
  }
}
