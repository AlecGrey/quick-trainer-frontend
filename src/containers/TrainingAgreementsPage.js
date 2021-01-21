import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import AgreementsList from '../components/AgreementsList';
import AgreementDetails from '../components/AgreementDetails';
import NewTrainingAgreement from '../components/NewTrainingAgreement';

const TrainingAgreementsPage = ({ user, agreements }) => {
    
    // STATE HOOKS FOR AGREEMENT DETAILS PAGE
    const [ activeAgreement, setActiveAgreement ] = useState(null)
    const [ showNewTrainingAgreement, setShowNewTrainingAgreement ] = useState(false)

    const currentAgreement = () => agreements.find(agreement => agreement.id === activeAgreement)
    
    return (
        <div id='agreements-roster-page' className='d-flex justify-content-stretch'>
            <AgreementsList 
                userIsTrainer={ user.isTrainer }
                agreements={ agreements }
                activeAgreement={ activeAgreement }
                setActiveAgreement={ setActiveAgreement }
                showNew={ showNewTrainingAgreement }
                setShowNew={ setShowNewTrainingAgreement }
            />
            { showNewTrainingAgreement ? 
                <NewTrainingAgreement 
                    closeTrainingAgreement={ () => setShowNewTrainingAgreement(false) }
                /> :
                <AgreementDetails userIsTrainer={ user.isTrainer } agreement={ currentAgreement() } />}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        agreements: state.agreements
    }
}

export default connect(mapStateToProps)(TrainingAgreementsPage);