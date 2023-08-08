import i18n from "../utils/i18next";
import * as Yup from "yup";

export const changePasswordValidationSchema = Yup.object({
    current_password: Yup.string().trim().required(i18n.t("errorMessages.currentPasswordIsRequired")),
    new_password: Yup.string()
        .trim()
        .min(8, i18n.t("errorMessages.weakPassword"))
        .max(32, i18n.t("errorMessages.tooLongPassword"))
        .required(i18n.t("errorMessages.newPasswordRequired")),
    confirm_password: Yup.string()
        .trim()
        .min(8, i18n.t("errorMessages.weakPassword"))
        .max(32, i18n.t("errorMessages.tooLongPassword"))
        .required(i18n.t("errorMessages.confirmPasswordIsRequired"))
        .oneOf([Yup.ref("new_password")], i18n.t("errorMessages.newPasswordDiiferentOldPassword")),
});

export const updateProfileValidationSchema = Yup.object({
    first_name: Yup.string()
        .trim()
        .max(32, i18n.t("errorMessages.firstNameIsTooLong"))
        .required(i18n.t("errorMessages.firstNameIsRequired")),
    last_name: Yup.string()
        .trim()
        .max(32, i18n.t("errorMessages.lastNameIsTooLong"))
        .required(i18n.t("errorMessages.lastNameIsRequired")),
    description: Yup.string()
        .trim()
        .min(8, i18n.t("errorMessages.descriptionTooWeak"))
        .max(200, i18n.t("errorMessages.descriptionTooLong"))
        .required(i18n.t("errorMessages.descriptionIsRequired")),
});
