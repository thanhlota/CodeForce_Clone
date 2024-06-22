const formatContest = (contests) => {
    return contests.map((contest) => {
        const { start_time, end_time } = contest;
        let state = null;
        const now = new Date();
        const startTime = new Date(start_time);
        const endTime = new Date(end_time);
        if (now < startTime) state = 'upcoming';
        else if (now > endTime) state = 'end';
        else state = 'ongoing';
        return {
            ...contest,
            state
        }
    });

}

export default formatContest;