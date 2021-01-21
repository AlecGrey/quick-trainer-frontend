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