import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { DatabaseModule } from '@/infra/database/database.module'
import { TechnologyFactory } from 'test/factories/make-technology'
import { JwtService } from '@nestjs/jwt'

describe('Get All Technologies(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let technologyFactory: TechnologyFactory
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TechnologyFactory, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    technologyFactory = moduleRef.get(TechnologyFactory)
    userFactory = moduleRef.get(UserFactory)
    await app.init()
  })

  test('[GET] /technologies', async () => {
    await technologyFactory.makePrismaTechnology({
      name: 'Docker',
    })
    await technologyFactory.makePrismaTechnology({
      name: 'Typescript',
    })
    await technologyFactory.makePrismaTechnology({
      name: 'Java',
    })

    const user = await userFactory.makePrismaUser({})
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/technologies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      technologies: [
        expect.objectContaining({
          name: 'Docker',
        }),
        expect.objectContaining({
          name: 'Typescript',
        }),
        expect.objectContaining({
          name: 'Java',
        }),
      ],
    })
  })
})
