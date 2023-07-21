import React from "react";
import WarningIcon from "./icons/WarningIcon";

type DeleteModalProps = {
    handleDelete: () => void;
    handleCancel: () => void;
};

const DeleteModal: React.FC<DeleteModalProps> = (props: DeleteModalProps) => {
    return (
        <>
            <div className="absolute z-50 w-full h-full top-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 w-[400px] flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[60px] h-[60px] rounded-full border border-black bg-[#FFFF00] mb-4 flex justify-center items-center">
                        <WarningIcon />
                    </div>
                    <div className="mb-2 text-center">
                        <p className="text-3xl mb-1">ARE YOU SURE?</p>
                        <span className="text-xl">You won't be able to revert it</span>
                    </div>
                    <div className="">
                        <button
                            className="py-2 px-4 mr-1 bg-error rounded-lg text-white text-xl hover:opacity-80"
                            onClick={props.handleDelete}
                        >
                            Yes, delete it
                        </button>
                        <button
                            className="py-2 px-4 mr-1 bg-white rounded-lg text-xl hover:opacity-80 border-[1px] border-black"
                            onClick={props.handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteModal;
