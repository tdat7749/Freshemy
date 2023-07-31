import React from "react";
import { Link } from "react-router-dom";
import EditIcon from "@src/components/icons/EditIcon";

const GuestButton: React.FC = () => {
    return (
        <div>
            <div className="flex gap-2">
                <Link to={`/register `}>
                    <button className="btn btn-primary bg-primary text-lg">
                        <EditIcon color="#ffffff" />
                        <span>Get it</span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default GuestButton;
