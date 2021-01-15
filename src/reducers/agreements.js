const AgreementsReducer = (state = [], action) => {
    switch (action.type) {
      case 'ADD_AGREEMENTS':
        // ADD FUNCTIONALITY HERE
        return [...state, ...action.agreements]
      default:
        return state
    }
}

export default AgreementsReducer