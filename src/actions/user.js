export const loginUser = (user = {}) => {
    return {
        type: 'LOGIN_USER',
        user
    }
}

export const updateUser = (user = {}) => {
    return {
        type: 'UPDATE_USER',
        user
    }
}