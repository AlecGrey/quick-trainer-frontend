export const addAgreements = (agreements = []) => {
    return {
        type: 'ADD_AGREEMENTS',
        agreements
    }
}

export const addAgreement = (agreement = {}) => {
    return {
        type: 'ADD_AGREEMENT',
        agreement
    }
}

export const addGoalToAgreement = ( params ) => {
    return {
        type: 'ADD_GOAL_TO_AGREEMENT',
        params
    }
}

export const addTrainingSessionToAgreement = ( params ) => {
    console.log('DISPATCH RECEIVED WITH PARAMS:')
    console.log(params)
    return {
        type: 'ADD_TRAINING_SESSION_TO_AGREEMENT',
        params
    }
}