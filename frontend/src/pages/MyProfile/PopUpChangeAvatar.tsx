import { authActions, fileStorageActions } from "@redux/slice";
import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import toast from "react-hot-toast";
type props = {
    urlAvatar: string;
    userId: number | undefined;
};
const FILE_TOO_BIG = 1;
const FILE_IS_NOT_SUPPORT = 2;
const FILE_IS_EMPTY = 3;
const FILE_SUPPORT = ["image/jpeg", "image/png"];
const PopUpChangeAvatar: React.FC<props> = (props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const avatarRef = useRef<HTMLImageElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isLoading: boolean = useAppSelector((state) => state.fileStorageSlice.isLoading);
    const [errorImage, setErrorImage] = useState<number>(FILE_IS_EMPTY);
    const dispatch = useAppDispatch();
    const openModal = () => {
        if (dialogRef.current) {
            setErrorImage(0);
            dialogRef.current.showModal();
        }
    };

    const closeModal = () => {
        if (dialogRef.current) {
            setErrorImage(0);
            dialogRef.current.close();
            if (avatarRef.current!.src) {
                avatarRef.current!.src = props.urlAvatar;
            }
            if (inputRef.current!.value) {
                inputRef.current!.value = "";
            }
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files![0];
        if (file) {
            if (avatarRef.current!.src) {
                avatarRef.current!.src = URL.createObjectURL(file);
                if (file.size >= 1024 * 1024 * 4) {
                    setErrorImage(FILE_TOO_BIG);
                } else if (!FILE_SUPPORT.includes(file.type)) {
                    setErrorImage(FILE_IS_NOT_SUPPORT);
                } else {
                    setErrorImage(0);
                }
            }
        } else {
            setErrorImage(FILE_IS_EMPTY);
            avatarRef.current!.src = props.urlAvatar;
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputRef.current!.value) {
            const formData = new FormData();
            formData.set("thumbnail", inputRef.current?.files?.[0] as File);
            formData.set("upload_preset", "Freshemy");
            formData.set("user_id", `${props.userId}`);
            //@ts-ignore
            dispatch(fileStorageActions.uploadAvatar(formData)).then((response) => {
                if (response.payload.status_code === 201) {
                    toast.success(response.payload.message);
                    // @ts-ignore
                    dispatch(authActions.setUrlAvatar(response.payload.data));
                    closeModal();
                } else {
                    toast.error(response.payload.message);
                }
            });
        } else {
            setErrorImage(FILE_IS_EMPTY);
        }
    };
    return (
        <>
            <img
                ref={avatarRef}
                src={props.urlAvatar}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full cursor-pointer"
                onClick={openModal}
            />
            <dialog ref={dialogRef} className="modal text-center">
                <form className="modal-box" onSubmit={handleSubmit}>
                    <img
                        ref={avatarRef}
                        src={props.urlAvatar}
                        alt="Avatar"
                        className="w-52 h-52 my-2 object-cover rounded-full mx-auto"
                    />

                    <input
                        ref={inputRef}
                        accept=".jpg, .png"
                        type="file"
                        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                        onChange={handleFileInputChange}
                    />
                    {errorImage === FILE_TOO_BIG ? (
                        <p className={`text-error italic font-medium mt-1`}>Size of the image is less than 4MB</p>
                    ) : (
                        <></>
                    )}
                    {errorImage === FILE_IS_NOT_SUPPORT ? (
                        <p className={`text-error italic font-medium mt-1`}>File is not support</p>
                    ) : (
                        <></>
                    )}
                    {errorImage === FILE_IS_EMPTY ? (
                        <p className={`text-error italic font-medium mt-1`}>File is Empty</p>
                    ) : (
                        <></>
                    )}
                    <div className="modal-action flex justify-center">
                        <button className={`btn btn-primary text-lg ${isLoading ? "btn-disabled" : ""}`} type="submit">
                            {isLoading ? "Loading..." : "Save"}
                        </button>
                        <button
                            className={`btn text-lg ${isLoading ? "btn-disabled" : ""}`}
                            type="button"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </dialog>
        </>
    );
};

export default PopUpChangeAvatar;
