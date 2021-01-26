import React from 'react';
import { GiStrong } from "react-icons/gi";

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
            <GiStrong size={ size }/>
        </div>  
    );
}

export default PlaceholderImage;
