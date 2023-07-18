export type Login = {
    email: string;
    password: string;
};

export type Token = {
    accessToken: string;
    refreshToken: string;
};

export type ForgotPassword = {
    email: string;
};

export type ResetPassword = {
    confirmPassword: string;
    password: string;
    token: string;
};
export type Register = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
};
