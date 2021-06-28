import { ApolloError } from 'apollo-server-errors';

export class NotFoundError extends ApolloError {
  constructor(id: string) {
    super(`Cannot find record: ${id}`, 'NOT_FOUND');
    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}
