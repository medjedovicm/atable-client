import { UserModel } from './UserModel';

export class ChatModel {
  _id: string;
  username: string;
  content: string;
  timestamp: string;
  full_name: string = "";
  user_id: string;
  team_id: string;
}
