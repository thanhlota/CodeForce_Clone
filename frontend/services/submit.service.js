const submitService = {
    create: async (data) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URI}/api/submission/submit`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(data)
            },

        );
        return await res.json();
    },
    getByUserAndContest: async (userId, contestId, page) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URI}/api/submission/all?uq=${userId}&ctq=${contestId}&page=${page}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );
        return await res.json();
    },
    getById: async (id) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URI}/api/submission/${id}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );
        return await res.json();
    },
    getByUserAndProblem: async (userId, problemId) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URI}/api/submission/all?uq=${userId}&pq=${problemId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );
        return await res.json();
    }
}
export default submitService;