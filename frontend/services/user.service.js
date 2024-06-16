const UserService = {
    login: async (info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_USER_SERVICE_URI}/api/user/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info),
                credentials: 'include' 
            },
        );
        return await res.json();
    },

    validateToken: async (accessToken) => {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_USER_SERVICE_URI}/api/user/validateToken`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        return await res.json();
    }
}
export default UserService;