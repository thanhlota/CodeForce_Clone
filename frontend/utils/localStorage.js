const storageHelper = {
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : {
            id: null,
            username: null,
            accessToken: null
        };
    }
}

export default storageHelper;