const AgreementsReducer = (state = [], action) => {
    let agreement, filteredAgreements, newState

    switch (action.type) {

      case 'ADD_AGREEMENTS':
        // ADD AGREEMENTS FROM PAGE LOAD
        return [...state, ...action.agreements]

      case 'ADD_AGREEMENT':
        // ADD NEW AGREEMENTS WHEN CREATED
        return [...state, action.agreement]

      case 'UPDATE_AGREEMENT':
        // RECEIVES UPDATED AGREEMENT TO REPLACE EXISTING AGREEMENT
        filteredAgreements = state.filter( a => a.id !== action.agreement.id )
        return [...filteredAgreements, action.agreement]

      case 'ADD_GOAL_TO_AGREEMENT':
        // WHEN A NEW GOAL IS CREATED, ADD TO STATE
        state.find(agreement => agreement.id === action.params.agreementId).goals.push( action.params.goal )
        return [...state]

      case 'UPDATE_GOAL_IN_AGREEMENT':
        // WHEN A COACH UPDATES A GOAL, ADD CHANGES TO STATE
        agreement = state.find(agreement => agreement.id === action.goal.coach_client_id)
        const filteredGoals = agreement.goals.filter(goal => goal.id !== action.goal.id)
        agreement.goals = [...filteredGoals, action.goal]
        filteredAgreements = state.filter(agreement => agreement.id !== action.goal.coach_client_id)
        newState = [...filteredAgreements, agreement]
        return newState

      case 'ADD_TRAINING_SESSION_TO_AGREEMENT':
        // WHEN A NEW TRAINING SESSION IS CREATED, ADD TO STATE
        state.find(agreement => agreement.id === action.params.agreementId).training_sessions.push( action.params.trainingSession )
        return [...state]

      case 'UPDATE_TRAINING_SESSION_IN_AGREEMENT':
        // WHEN A TRAINING SESSION IS RETURNED AFTER A PATCH, FIND AND REPLACE SESSION IN STATE
        agreement = state.find(agreement => agreement.id === action.params.coach_client_id)
        const filteredSessions = agreement.training_sessions.filter(session => session.id !== action.params.id)
        agreement.training_sessions = [...filteredSessions, action.params]
        return [...state]

      case 'ADD_CHAT_MESSAGE_TO_AGREEMENT':
        // RECEIVE NEW CHAT MESSAGE AND UPDATE STORE
        agreement = state.find(agreement => agreement.id === action.params.agreementId)
        agreement.chat_messages.push(action.params.chatMessage)
        return [...state]

      case 'LOGOUT_USER':
        return []

      default:
        return state
    }
}

export default AgreementsReducer