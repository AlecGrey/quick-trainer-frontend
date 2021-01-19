import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import AgreementsList from '../components/AgreementsList';
import AgreementDetails from '../components/AgreementDetails';

const TrainingAgreementsPage = ({ user, agreements }) => {

    const [ activeAgreement, setActiveAgreement ] = useState(null)

    const currentAgreement = () => agreements.find(agreement => agreement.id === activeAgreement)
    
    return (
        <div id='agreements-roster-page' className='d-flex justify-content-stretch'>
            <AgreementsList 
                userIsTrainer={ user.isTrainer }
                agreements={ agreements }
                activeAgreement={ activeAgreement }
                setActiveAgreement={ setActiveAgreement }
            />
            <AgreementDetails
                userIsTrainer={ user.isTrainer }
                agreement={ currentAgreement() }
            />
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