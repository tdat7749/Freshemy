// messages.ts
export const HTTP_CALL = {
    HTTP_POST: "POST",
    HTTP_GET: "GET",
    HTTP_PATCH: "PATCH",
    HTTP_PUT: "PUT",
    HTTP_DELETE: "DELETE",
};

export const errorMessages = {
    wrongPassword: "Wrong password",
    weakPassword: "Weak password",
    tooLongPassword: "Password is too long",
    emailNotExist: "Email does not exist",
    validationFail: "Validation fail",
    internalServer: "Internal server",
    invalidEmail: "Invalid email",
    emailIsRequired: "Email is required",
    passwordIsRequired: "Password is required",
    newPasswordRequired: "New Password is required",
    confirmPasswordIsRequired: "Confirm Password is required",
    wrongConfirmPasswordIsRequired: "Wrong Confirm Password is required",

    titleIsRequired: "Title is required",
    titleTooLong: "Title is too long, under 100 characters only",
    summaryTooLong: "Summary is too long, under 200 characters only",
    descriptionTooWeak: "Description is too short, minimum 8 characters",
    descriptionTooLong: "Description is too long, under 200 characters only",
    summaryIsRequired: "Summary is required",
    descriptionIsRequired: "Description is required",
    currentPasswordIsRequired: "Current password is required",
    newPasswordIsRequired: "New password is required",
    firstNameIsRequired: "First Name is required",
    lastNameIsRequired: "Last Name is required",
    firstNameIsTooLong: "First Name is maximum 32 character",
    lastNameIsTooLong: "Last Name is maximum 32 character",
    newPasswordDiiferentOldPassword: "Confirm password must be the same with new password",

    categoriesIsRequired: "Category is required",
    categoriesMaxAllowed: "Categories Max Allowied are 4",

    fileIsNotSupport: "File is not support",
    thumbnailIsRequired: "Thumbnail is required",
    thumbnailTooBig: "Thumbnail too big",

    videoFileType: "Invalid file type, .mp4 .mkv .mov file only",
    videoFileSize: "Video too large, video size lower than 100MB only",
};

export const successMessages = {
    verificationForgotPassword: "Sent a verification code to your email",
};

export const fileType = {
    mp4: "mp4",
    mkv: "mkv",
    mov: "mov",
    png: "png",
    jpg: "jpg",
    jpeg: "jpeg",
};
