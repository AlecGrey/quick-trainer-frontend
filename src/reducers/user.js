const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_USER':
        return {...action.user}

      case 'UPDATE_USER':
        return {
          ...state,
          ...action.user
        }

      case 'LOGOUT_USER':
        return {
          ...initialState
        }

      default:
        return state
    }
}

const initialState = {
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

export default userReducer