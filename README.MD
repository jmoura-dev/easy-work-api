- [x] It must be possible to register as a developer or company;
- [x] It must be possible to authenticate to access some functions;
- [x] It must be possible to change developer or company data;
- [x] A company can register a new vacancy;
- [x] A developer can register for a new vacancy;
- [x] The developer can search for a list of all the vacancies he has applied for;
- [x] Whenever the status of the application changes, a notification will be sent to the candidate;
- [x] A developer cannot register for the same vacancy more than once;
- [x] The company can search for the list of developers who registered for the posted vacancy;
- [x] The developer will be able to change the profile avatar;

# Easy-Work-API
Infrastructure layer using the domain-based(DDD) NestJS Framework..

### Techs:
- **Nodejs**, **Nestjs**, **Docker**, **Clean-Architecture**, **DDD(Domain-driven-design)**, **Supertest**, **Typescript**, **Zod**, **JWT-authenticate**, **Tests(Unit tests and E2E)**, **Middlewares**, **POO**, **DomainEvents**;

### Database:
**PrismaORM**, **Postgres**

## 📁 Project

- Creation of an api to advertise developer vacancies and freelance developers;

## 💡 Functionalities

- Is it possible to create a new user;
- Is it possible changes status of candidatures;
- There are two personas (company/developer);
- Whenever the status changes, a notification is sent to the user;
- Integration with external service for uploading files(R2-Cloudflare);


## 👨🏽‍💻 To use
### Steps:
#### Important - (Check the environment variables according to your settings and preferences.);

- git clone https://github.com/jmoura-dev/easy-work-api.git
- cd easy-work-api
- pnpm i
- pnpm run start:dev

[Link-Deploy](https://easy-work.onrender.com)
