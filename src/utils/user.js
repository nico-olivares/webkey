function getUserFromStorage() {
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user) {
        console.log('No User Found')
        return {}
    }

    return user
}

export default {
    getUserFromStorage
}