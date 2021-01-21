const AgreementsReducer = (state = [], action) => {
    switch (action.type) {

      case 'ADD_AGREEMENTS':
        // ADD AGREEMENTS FROM PAGE LOAD
        return [...state, ...action.agreements]

      case 'ADD_AGREEMENT':
        // ADD NEW AGREEMENTS WHEN CREATED
        return [...state, action.agreement]

      case 'ADD_GOAL_TO_AGREEMENT':
        // WHEN A NEW GOAL IS CREATED, ADD TO STATE
        state.find(agreement => agreement.id === action.params.agreementId).goals.push( action.params.goal )
        return [...state]

      case 'ADD_TRAINING_SESSION_TO_AGREEMENT':
        // WHEN A NEW TRAINING SESSION IS CREATED, ADD TO STATE
        state.find(agreement => agreement.id === action.params.agreementId).training_sessions.push( action.params.trainingSession )
        return [...state]

      default:
        return state
    }
}

export default AgreementsReducer