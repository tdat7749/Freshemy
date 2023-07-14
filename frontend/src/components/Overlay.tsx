import React from "react";

interface OverlayProps {
    toggleDropDown: () => void;
}

const Overlay: React.FC<OverlayProps> = (props) => {
    return (
        <>
            <div
                className="fixed z-10 w-screen h-screen backdrop-brightness-90 tablet:hidden"
                onClick={props.toggleDropDown}
            ></div>
        </>
    );
};

export default Overlay;
