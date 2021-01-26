import React from 'react';
import { FaUser } from "react-icons/fa";

const PlaceholderImage = ({ size }) => {
    return (
        <div className='placeholder-image shadow'>
            <FaUser size={ size }/>
        </div>  
    );
}

export default PlaceholderImage;
