const formatContest = (contests) => {
    return contests.map((contest) => {
        const { start_time, end_time } = contest;
        let state = null;
        const now = new Date();
        let startTime = new Date(start_time);
        let endTime = new Date(end_time);
        if (now < startTime) state = 'upcoming';
        else if (now > endTime) state = 'end';
        else state = 'ongoing';
        startTime = formatDateString(start_time);
        endTime = formatDateString(end_time);
        return {
            ...contest,
            state,
            start_time: startTime,
            end_time: endTime
        }
    });

}

const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default formatContest;