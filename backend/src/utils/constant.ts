export const errorMessages = {
    validationFail: "Validation fail",
    internalServer: "Internal server",
    badRequest: "Bad request",
    missingRequestBody: "Missing the request body",
    //Data failed
    getDataFailed: "Cannot find requested resources",

    // Token
    tokenExpired: "The verification code has expired, please login so we can resend it",
    tokenVerfiedCode: "The verification code is not correct",
    tokenGernerateCode: "This verification code was never generated",

    // Password
    wrongPassword: "Wrong password",
    weakPassword: "Weak password",
    tooLongPassword: "Password is too long",
    passwordIsRequired: "Password is required",
    newPasswordIsRequired: "New Password is required",
    currentPasswordIsRequired: "Current password is required",
    confirmPasswordIsRequired: "Confirm Password is required",
    newPasswordDiiferentOldPassword: "Confirm password must be the same with new password",
    wrongConfirmPasswordIsRequired: "Wrong Confirm Password is required",
    passwordMustBeString: "Password must be a string",
    passWordAndConfirmPasswordMustBeSameRequired: "Password and comfirm password must be same required !",
    

    // Email
    emailNotExist: "Email does not exist",
    emailAlreadyExists: "Email already exists",
    invalidEmail: "Invalid email",
    emailIsRequired: "Email is required",
    emailMustBeString: "Email must be a string",
    inCorrectEmail: "Incorrect email",
    errorSendEmail:
        "Email sending failed, please login to the account you just registered to be sent confirmation email again",

    // Verified Email
    verifiedEmail: "This account has been verified before",
    verifiedEmailFailed: "Verify email failed",

    // Login
    loginFailed: "Email or password is invalid",
    signUpFailed: "Sign Up Failed",

    // User
    userNotFound: " User is not found ",
    loginUnverified:
        "Unverified account, We have sent you a verification link, please check your email soon before it expires!",

    // Firstname
    firstNameMustBeString: "First Name must be a string",
    firstNameIsRequired: "First Name is required",

    // Lastname
    lastNameMustBeString: "Last Name must be a string",
    lastNameIsRequired: "Last Name is required",

    // Course
    courseIdIsRequired: "Course id is required",
    courseIdMustBeNumber: "Course id must be a number",
    createCourseFailed: "Create a new failed course",
    courseNotFound: "Course Not Found",

    // Section
    sectionIdIsRequired: "Section id is required",

    // Reset password
    UnAuthorized: "You don't have authorize",

    // Slug
    slugIsUsed: "This slug is already in use",
    courseSlugIsRequired: "Course Slug is required",
    courseSlugMalformed: "Course Slug malformed",
    courseSlugMustBeString: "Course Slug must be a string",

    // Title
    courseTitleIsRequired: "Title is required",
    courseTitleMustBeString: "Title must be a string",

    // Status
    statusIsRequired: "Status is required",
    statusMustBeBoolean: "Status must be a boolean",

    // Description
    descriptionIsRequired: "Description is required",
    descriptionMustBeString: "Description must be a string",

    // Summary
    summaryIsRequired: "Summary is required",
    summaryMustBeString: "Summary must be a string",

    // Category
    categoryArrayNumber: "Categories must be a array int",
    // export const MESSAGE_ERROR_CATEGORIES_ARRAY_NUMBER = "Categories must be a array int";
    categoryIsRequired: "Categories is required",
    categoryNotFound: "Category Not Found",

    // Thumbnail
    thumbnailIsRequired: "Thumbnail is required",
};

export const successMessages = {
    // Request
    requestSuccess: "Request successful",

    // Request Body
    validationFailed: "Validation failed",

    // Data Success
    getDataSuccess: "Get data successfully",
    createDataSuccess: "Create successfully",
    updateDataSuccess: "Update successfully",
    deleteDataSuccess: "Delete successfully",

    // Email
    verificationForgotPassword: "Sent a verification code to your email",

    // Verified Email
    verifiedEmail: "Account verification successful",
    verifiedEmailBefore: "This account has been verified before",

    // Password
    changePasswordSuccessfully: "Change password succesfully",

    // Login
    successLogin: "Logged in successfully",

    // Sign-up
    signUpSuccess: "Signup successful, please check your email",

    // Register Course
    registerCourseSuccess: "Subcribe successfully",
    unRegisterCourseSuccess: "Unsubcribe successfully",

    // Reset password
    resetPasswordSuccess: "Reset successfully, please login your account",

    // Course
    createCourseSuccess: "Create a new successful course",
    searchMyCourseSuccess: "Search My Course Successfully",
    deleteCourseSuccess: "Course Deleted Successfully",

    // Category
    getAllCategoriesSuccess: "Get All Categories Successfully",
    getCategoryByIdSuccess: "Get Category By Id Successfully",
    createCategorySuccess: "Category Created Successfully",
    retrievedCategorySuccess: "Categories Retrieved Successfully",
    updatedCategorySuccess: "Category Updated Successfully",
    deletedCategorySuccess: "Category Deleted Successfully",
};




