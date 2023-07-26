import React, { FC } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

type SelectProps = {
    defautlValues: any;
    placeholder: any;
    handleOnchange: () => void;
    options: any;
    isMulti: boolean;
    styles: any;
};

const CustomeSelect: FC<SelectProps> = (props) => {
    const animatedComponents = makeAnimated();
    return (
        <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={props.defautlValues}
            placeholder={props.placeholder}
            isMulti={props.isMulti}
            onChange={props.handleOnchange}
            options={props.options}
            styles={props.styles}
        />
    );
};

export default CustomeSelect;
