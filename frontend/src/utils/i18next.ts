import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { errorMessages, successMessages } from "../utils/contants"; // Import the translation object for errorMessages

// Khởi tạo i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "vn", 
    debug: true, 
    resources: {
      vn: {
        translation: {
          errorMessages, 
          successMessages 
        },
      },
    },
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
