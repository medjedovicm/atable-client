import { TaskModel } from './TaskModel';

export class AtableUserModel {
  _id: string;
  email: string;
  username: string;
  full_name: string = "";
  profile_image: string;
  isOnline: boolean;
  atable_entries: AtableTime[];
}

export class AtableTime {
    _id: string;
    date: Date | undefined;
    description: string = "";
    start_time: string = "";
    end_time: string = "";
    assigned_task?: TaskModel;
    task_id: string;
    team_id: string;
    user_id: string;
}
