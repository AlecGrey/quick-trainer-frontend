import React from 'react';

const AgreementsList = ({ userIsTrainer, agreements, activeAgreement, setActiveAgreement }) => {

    const handleOnClick = event => {
        const selectedID = event.target.id
        activeAgreement === selectedID ? 
            setActiveAgreement(null) : 
            setActiveAgreement(event.target.id)
    }

    const renderClientLinks = () => {
        return agreements.map( agreement => {
            return <li 
                key={ agreement.id } 
                id={ agreement.id } 
                className={ agreement.id === activeAgreement ? 'selected' : null } 
                onClick={ handleOnClick }>
                        { userIsTrainer ? agreement.client.name : agreement.trainer.name }
                    </li>
        })
    }

    return (
        <div id='agreements-list-container' className='d-flex flex-column align-items-start'>
            <h1 id='agreements-list-title' className='display-4'>
                { userIsTrainer === null ? 'Loading...' : userIsTrainer ? 'Clients' : 'Coaches' }
            </h1>
            <div className='h-divider' />
            <ul id='agreements-list'>
                { renderClientLinks() }
            </ul>

        </div>
    );
}

export default AgreementsList;
