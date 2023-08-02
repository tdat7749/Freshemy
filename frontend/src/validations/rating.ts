import i18n from "../utils/i18next";
import * as Yup from "yup";
export const ratingValidationSchema = Yup.object({
    content: Yup.string().trim().max(100, i18n.t("errorMessages.commentTooLong")),
});
