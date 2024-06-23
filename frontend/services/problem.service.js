const problemService = {
    getProblems: async () => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/problem/all`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );
        return await res.json();
    },
    getProblemById: async (id) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/problem/${id}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        return await res.json();
    },
    getProblemByContest: async (contestId) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/problem/all?cs=${contestId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        )
        return await res.json();
    }
}
export default problemService;