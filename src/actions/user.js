export const loginUser = (user = {}) => {
    return {
        type: 'LOGIN_USER',
        user
    }
}

export const logoutUser = () => {
    return {
        type: 'LOGOUT_USER'
    }
}

export const updateUser = (user = {}) => {
    return {
        type: 'UPDATE_USER',
        user
    }
}