import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { User, UserProps } from './user'

export interface CompanyProps extends UserProps {
  cnpj: string
  city: string | null
  state: string | null
  site_url: string | null
}

export class Company extends User<CompanyProps> {
  get cnpj() {
    return this.props.cnpj
  }

  set cnpj(cnpj: string) {
    this.props.cnpj = cnpj
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get site_url() {
    return this.props.site_url
  }

  set site_url(site_url: string | null) {
    this.props.site_url = site_url
  }

  static create(
    props: Optional<CompanyProps, 'city' | 'state' | 'site_url'>,
    id?: UniqueEntityID,
  ) {
    const company = new Company(
      {
        ...props,
        city: props.city ?? null,
        state: props.state ?? null,
        site_url: props.site_url ?? null,
      },
      id,
    )

    return company
  }
}
