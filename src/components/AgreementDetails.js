import React, { useState, useEffect } from 'react';
import Image from 'react-bootstrap/Image'

const AgreementDetails = ({ userIsTrainer, agreement }) => {

    const loadPageDetails = () => {
        return (
            <>
                { userIsTrainer ? 
                    <AgreementHeader 
                        name={ agreement.client.name }
                        imageUrl={ agreement.client.image_url }
                        sessionsRemaining={ agreement.sessions_remaining }
                    /> : 
                    <AgreementHeader
                        name={ agreement.trainer.name }
                        imageUrl={ agreement.trainer.image_url }
                        sessionsRemaining={ agreement.sessions_remaining }
                    /> }
                { userIsTrainer ? 
                    <Bio bio={ agreement.client.bio } /> :
                    <Bio bio={ agreement.trainer.bio } /> 
                }
                {
                    userIsTrainer ?
                    <Demographics 
                        height={ agreement.client.height }
                        weight={ agreement.client.weight }
                        birthdate={ agreement.client.date_of_birth }
                    /> : null
                    // <Credentials
                    //     specialty={ agreement.trainer.specialty }
                    //     certification={ agreement.trainer.credentials }
                    // />

                }               
            </>
        )
    }

    return (
        <div id='agreement-details-container' className='flex-grow-1 d-flex flex-column align-items-stretch'>
            {
                !agreement ? null : loadPageDetails()
            }
        </div>
    );
}

const AgreementHeader = ({ name, imageUrl, sessionsRemaining }) => {
    return (
        <>
            <div id='agreement-header' className='d-flex align-items-end'>
                <Image className='agreement-image' src={ imageUrl }/>
                <h1 className='display-name flex-grow-1'>{ name }</h1>
                <p className='sessions-remaining'>Sessions Remaining:</p>
                <h1 className='display-remaining-sessions'>{ sessionsRemaining }</h1>
            </div>
            <div className='h-divider'/>
        </>
    )
}

const Bio = ({ bio }) => {
    return (
        <div id='bio-container' className='d-flex'>
            <h3 className='user-bio-header'>Bio</h3>
            <p className='user-bio-content flex-grow-1'>{ bio }</p>
        </div>
    )
}

const Demographics = ({ height, weight, birthdate }) => {

    const birthdateField = () => {
        const dateArray = birthdate.split('-')
        return `${monthConverter[dateArray[1]]} ${dateArray[2]}, ${dateArray[0]} (Age: ${currentAge()})`
    }

    const currentAge = () => {
        const timeOfBirth = new Date( birthdate )
        const diff = new Date( Date.now() - timeOfBirth )
        return diff.getUTCFullYear() - 1970
        
    }

    const monthConverter = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }

    return (
        <div id='demographics-container'>
            <h1>Demographics</h1>
            <div className='h-divider' />
            <div className='information-grid'>
                <div className='d-flex height'>
                    <h3>Height:</h3>
                    <p>{ height }</p>
                </div>
                <div className='d-flex weight'>
                    <h3>Weight:</h3>
                    <p>{ weight }</p>
                </div>
                <div className='d-flex birthdate'>
                    <h3>Date of Birth:</h3>
                    <p>{ birthdateField() }</p>
                </div>
            </div>
        </div>
    )
}

export default AgreementDetails;
