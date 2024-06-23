const contestService = {
    getContests: async () => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/contest/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );
        return await res.json();
    },
    getContestById: async (id) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/contest/${id}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        return await res.json();
    },

    addContest: async (info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/contest/admin/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(info),
            },
        );
        return res;
    },

    updateContest: async (info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/contest/admin/update/${info.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(info),
            },
        );
        return res;
    },

    deleteContest: async (id) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/contest/admin/remove/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            }
        );
        return await res.json();
    }
}
export default contestService;