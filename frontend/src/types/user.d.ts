export type User = {
    url_avatar?: string;
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

export type UpdateInformation = {
    first_name: string | undefined;
    last_name: string | undefined;
    description: string | undefined;
};
