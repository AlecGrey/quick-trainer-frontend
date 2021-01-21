const AgreementsReducer = (state = [], action) => {
    switch (action.type) {

      case 'ADD_AGREEMENTS':
        // ADD AGREEMENTS FROM PAGE LOAD
        return [...state, ...action.agreements]

      case 'ADD_AGREEMENT':
        // ADD NEW AGREEMENTS WHEN CREATED
        return [...state, action.agreement]

      default:
        return state
    }
}

export default AgreementsReducer