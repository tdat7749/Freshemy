export type User = {
    email?: string;
    description?: string;
    first_name?: string;
    last_name?: string;
    id?: number;
    password?: string;
};

export type ChangePassword = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};
