export abstract class HashGenerator {
  abstract hash(password: string): Promise<string>
}
