export abstract class HashComparer {
  abstract compare(password: string, passwordHashed: string): Promise<boolean>
}
