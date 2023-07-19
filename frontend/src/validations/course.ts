import * as Yup from "yup";



export const createValidationSchema = Yup.object({
    title: Yup.string().trim().required("Title is required"),
    status: Yup.number().required("Status is required"),
    summary: Yup.string().trim().required("Summary is required"),
    description: Yup.string().trim().required("Description is required"),
});