const rankingService = {
    getRankings: async (contestId) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_RANKING_SERVICE_URI}/api/ranking/${contestId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );
        return await res.json();
    },
    syncRanking: async (contestId) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_RANKING_SERVICE_URI}/api/ranking/sync`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    { contestId }
                ),
            },
        );
        return await res.json();
    }
}

export default rankingService;