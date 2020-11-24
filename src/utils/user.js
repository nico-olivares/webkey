function getUserFromStorage() {
    const user = JSON.parse(localStorage.getItem('webkey-user'))

    if (!user) {
        
        return {}
    }

    return user
}

export default {
    getUserFromStorage
}