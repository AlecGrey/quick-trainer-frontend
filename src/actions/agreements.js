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

export const updateAgreement = (agreement = {}) => {
    return {
        type: 'UPDATE_AGREEMENT',
        agreement
    }
}

export const addGoalToAgreement = ( params ) => {
    return {
        type: 'ADD_GOAL_TO_AGREEMENT',
        params
    }
}

export const updateGoalInAgreement = ( goal ) => {
    return {
        type: 'UPDATE_GOAL_IN_AGREEMENT',
        goal
    }
}

export const addTrainingSessionToAgreement = ( params ) => {
    return {
        type: 'ADD_TRAINING_SESSION_TO_AGREEMENT',
        params
    }
}

export const updateTrainingSessionInAgreement = ( params ) => {
    return {
        type: 'UPDATE_TRAINING_SESSION_IN_AGREEMENT',
        params
    }
}

export const addChatMessageToAgreement = ( params ) => {
    return {
        type: 'ADD_CHAT_MESSAGE_TO_AGREEMENT',
        params
    }
}