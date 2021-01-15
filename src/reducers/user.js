const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_USER':
        // ADD FUNCTIONALITY HERE
        return {...action.user}
      default:
        return state
    }
}

const initialState = {
    token: null,
    name: null,
    isTrainer: null,
    specialty: null,
    credentials: null,
    dateOfBirth: null,
    height: null,
    weight: null,
    bio: null,
    imageUrl: null
}

export default rootReducer