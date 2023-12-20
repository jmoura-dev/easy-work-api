import { hash, compare } from 'bcryptjs'

import { HashComparer } from '@/domain/easy-work/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/easy-work/application/cryptography/hash-generator'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(password: string): Promise<string> {
    return hash(password, this.HASH_SALT_LENGTH)
  }

  compare(password: string, passwordHashed: string): Promise<boolean> {
    return compare(password, passwordHashed)
  }
}
