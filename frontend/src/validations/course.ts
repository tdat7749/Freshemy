import * as Yup from "yup";



export const createValidationSchema = Yup.object({
    title: Yup.string().trim().required("Title is required"),
    categories: Yup.string().required("Categories is required"),
    status: Yup.string().required("Status is required"),
    summary: Yup.string().trim().required("Summary is required"),
    description: Yup.string().trim().required("Description is required"),
});