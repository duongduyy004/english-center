import { Class } from '../classes/class.domain';
export class Registration {
  id: string;
  email: string;
  name: string;
  phone: string;
  gender: string;
  address: string;
  note: string;
  processed: boolean;

  class?: Partial<Class>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
