import React from 'react';

const AgreementsList = ({ userIsTrainer, agreements, activeAgreement, setActiveAgreement, showNew, setShowNew }) => {

    const handleOnClick = event => {
        const selectedID = event.target.id
        activeAgreement === selectedID ? 
            setActiveAgreement(null) : 
            toggleAgreement(selectedID)
    }

    const toggleAgreement = id => {
        setActiveAgreement(id)
        setShowNew(false)
    }
    
    const handleNewAgreement = event => {
        setShowNew(!showNew)
        setActiveAgreement(null)
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

    const newAgreementLinkClassName = () => {
        if ( showNew ) return 'create-new-item new-agreement-link selected'
        else return 'create-new-item new-agreement-link'
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
            { 
            userIsTrainer ? null : 
            <h3 onClick={ handleNewAgreement } className={ newAgreementLinkClassName() }>
                New Training Agreement
            </h3>
            }
        </div>
    );
}

export default AgreementsList;
