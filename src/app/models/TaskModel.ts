import { UserModel } from './UserModel';

export class TaskModel {
    _id: string;
    title: string = "";
    description: string = "";
    users_assigned: string[];
    team_id: string;
    spent_hours: number;
    comment_count: number;
    isTaskActive: boolean;
    user_profiles: UserModel[];
}

export class TaskCommentModel {
    _id: string;
    content: string;
    user_profile: UserModel;
    team_id: string;
    task_id: string;
    user_id: string;
    timestamp: string;
}