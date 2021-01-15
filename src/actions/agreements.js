export const addAgreements = (agreements = []) => {
    return {
        type: 'ADD_AGREEMENTS',
        agreements
    }
}