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
    }
}
export default contestService;