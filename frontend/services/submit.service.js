const submitService = {
    create: async (data) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URI}/api/submission/submit`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            },
        );
        return await res.json();
    },
    getByUserAndContest: async (userId, contestId) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URI}/api/submission/all?uq=${userId}&ctq=${contestId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );
        return await res.json();
    }
}
export default submitService;