export type UploadFile = {
    thumbnail: File | undefined;
    upload_preset: string;
};

export type FileInformation = {
    public_id: string | undefined;
    width: number | undefined;
    height: number | undefined;
    url: string | undefined;
    secure_url: string | undefined;
};
