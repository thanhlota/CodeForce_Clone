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
    ,
    getUsers: async (accessToken) => {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_USER_SERVICE_URI}/api/user/all`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        return await res.json();
    },
    
    addUser: async ( info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_USER_SERVICE_URI}/api/user/admin/add-user`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(info),
            },
        );
        return await res.json();
    },
    updateUser: async (accessToken, info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_USER_SERVICE_URI}/api/user/admin/update-user`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(info),
            },
        );
        return await res.json();
    },

    deleteUser: async (accessToken, userId) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_USER_SERVICE_URI}/api/user/admin/remove-user/${userId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
            }
        );
        return await res.json();
    }

}
export default UserService;