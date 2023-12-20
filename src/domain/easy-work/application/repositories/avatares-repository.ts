import { Avatar } from '../../enterprise/entities/avatar'

export abstract class AvataresRepository {
  abstract create(avatar: Avatar): Promise<void>
}
