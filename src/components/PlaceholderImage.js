import React from 'react';
import { FaUser } from "react-icons/fa";

const PlaceholderImage = ({ size, padding, noShadow, borderRadius }) => {

    const className = () => {
        let name = 'placeholder-image'
        name += !!noShadow ? '' : ' shadow'
        return name
    }

    const customStyleObject = () => {
        const style = {}
        if (!!padding) style.padding = padding
        if (!!borderRadius) style.borderRadius = borderRadius
        return style
    }

    return (
        <div className={ className() } style={ customStyleObject() }>
            <FaUser size={ size }/>
        </div>  
    );
}

export default PlaceholderImage;
