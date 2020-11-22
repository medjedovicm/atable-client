export class UserModel {
    _id: string;
    username: string;
    email: string;
    role: string;
    working_time: string;
    full_name: string = "";
    last_login: string;
    profile_image: string;
    isOnline: boolean;
    isActivated: boolean;
}
