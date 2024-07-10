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
    getTrainingProblems: async () => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/problem/all?isUser=true`,
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
    adminGetProblemById: async (id) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/problem/admin/${id}?role=admin`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
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
    },
    addProblem: async (info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/problem/admin/create`,
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
    deleteProblem: async (id) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/problem/admin/remove/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            }
        );
        return res;
    },
    updateProblem: async (info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/problem/admin/update/${info.id}`,
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
    addTestcase: async (info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/testcase/admin/create`,
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
    updateTestcase: async (info) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/testcase/admin/update/${info.id}`,
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
    deleteTestcase: async (id) => {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_CONTEST_SERVICE_URI}/api/testcase/admin/remove/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            }
        );
        return res;
    }
}
export default problemService;