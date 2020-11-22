import { UserModel } from './UserModel';

export class NotificationModel {
    _id: string;
    title: string;
    text: string;
    team_id: string;
    task_id: string;
    user_id: string;
    user_profile: UserModel;
    timestamp; Date;
    users_read: string[] = [];
}