import React, { useState, useEffect } from 'react';

const AgreementsList = ({ userIsTrainer, agreements, activeAgreement, setActiveAgreement, showNew, setShowNew }) => {

    const [ activeAgreements, setActiveAgreements ] = useState([])
    const [ pendingAgreements, setPendingAgreements ] = useState([])

    useEffect(() => {
        setActiveAgreements( filterActiveAgreements() )
        setPendingAgreements( filterPendingAgreements() )
    }, [ agreements ])

    const filterActiveAgreements = () => {
        return agreements.filter( agreement => agreement.accepted_agreement )
    }

    const filterPendingAgreements = () => {
        return agreements.filter( agreement => agreement.accepted_agreement === null )
    }

    const handleOnClick = event => {
        // debugger
        const selectedID = parseInt(event.target.id)
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

    const renderAgreementLinks = ( status ) => {
        // SET WHETHER TO RENDER ALL PENDING OR ALL ACTIVE AGREEMENTS IN DATASET
        let agreementArray
        if ( status === 'ACTIVE' ) agreementArray = activeAgreements
        else if ( status === 'PENDING' ) agreementArray = pendingAgreements
        // RENDER NOTHING IF OPTIONS ARE NOT HIT
        else return []

        return agreementArray.map( (agreement, i) => {
            return <li 
                key={ i } 
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

    const renderActiveAgreements = () => {
        return (
            <>
                <h1 id='agreements-list-title' className='display-4'>
                    { userIsTrainer === null ? 'Loading...' : userIsTrainer ? 'Clients' : 'Coaches' }
                </h1>
                <div className='h-divider' />
                <ul id='agreements-list'>
                    { renderAgreementLinks( 'ACTIVE' ) }
                </ul>  
            </>
        )
    }

    const renderPendingAgreements = () => {
        return (
            <>
                <h1 id='pending-agreements-list-title' className='display-4'>
                    Pending Agreements
                </h1>
                <div className='h-divider' />
                <ul id='agreements-list'>
                    { renderAgreementLinks( 'PENDING' ) }
                </ul>
            </>
        )
    }

    return (
        <div id='agreements-list-container' className='d-flex flex-column align-items-start'>
            {/* RENDER EACH LIST CONDITIONALLY */}
            { activeAgreements.length > 0 ? renderActiveAgreements() : null }
            { pendingAgreements.length > 0 ? renderPendingAgreements() : null }

            {/* IF THE USER IS NOT A COACH, ALLOW TO ACCESS FORM TO CREATE NEW AGREEMENT */}
            { userIsTrainer ? null : 
            <h3 onClick={ handleNewAgreement } className={ newAgreementLinkClassName() }>
                New Training Agreement
            </h3>}
        </div>
    );
}

export default AgreementsList;
