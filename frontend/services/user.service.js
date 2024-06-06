const UserService = {
    login: async (info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_USER_SERVICE_URI}/api/user/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            },
        );
        return await res.json();
    },

}
export default UserService;