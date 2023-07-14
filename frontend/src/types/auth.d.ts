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
};

