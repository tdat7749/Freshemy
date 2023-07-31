import React from "react";
import { Link } from "react-router-dom";
import EditIcon from "@src/components/icons/EditIcon";

const SubscribeUserButton: React.FC = () => {
    return (
        <div>
            <div className="flex gap-2">
                <Link to={`/register `}>
                    <button className="btn btn-primary text-lg">
                        <EditIcon color="#ffffff" />
                        <span>Learn now</span>
                    </button>
                </Link>
                <button className="btn btn-primary text-lg">
                    <EditIcon color="#ffffff" />
                    <span>Vote</span>
                </button>
                <button className="btn btn-error text-lg">
                    <span>Unsubcribe</span>
                </button>
            </div>
        </div>
    );
};

export default SubscribeUserButton;
