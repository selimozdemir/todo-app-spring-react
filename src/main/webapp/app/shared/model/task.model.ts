import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { ITask } from 'app/shared/model//task.model';

export const enum Status {
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

export interface ITask {
  id?: number;
  name?: string;
  description?: string;
  createDate?: Moment;
  deadline?: Moment;
  status?: Status;
  user?: IUser;
  task?: ITask;
  parents?: ITask[];
}

export const defaultValue: Readonly<ITask> = {};
