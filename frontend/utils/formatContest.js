const moment = require('moment-timezone');

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
        startTime = formatDateString2(start_time);
        endTime = formatDateString2(end_time);
        const display_start = formatDateString(start_time);
        const display_end = formatDateString(end_time);
        return {
            ...contest,
            state,
            start_time: startTime,
            end_time: endTime,
            display_start,
            display_end
        }
    });

}

const formatDateString = (dateString) => {
    const momentDate = moment.utc(dateString);
    const formattedDate = momentDate.format('MMM/DD/YYYY HH:mm');
    return formattedDate;
};

const formatDateString2 = (dateString) => {
    const formattedDate = moment.utc(dateString).format('YYYY-MM-DDTHH:mm');
    return formattedDate;
}

const getCurrentDate = () => {
    return moment().utc(false).format('YYYY-MM-DDTHH:mm');
}

const formatDateString3 = (dateString) => {
    return moment(dateString).utc(true).format('MMM/DD/YYYY HH:mm');
}
const formatContest2 = (contests) => {
    const now = new Date();
    const ongoingContests = [];
    const upcomingContests = [];
    const endedContests = [];
    contests.forEach(contest => {
        const startTime = new Date(contest.start_time);
        const endTime = new Date(contest.end_time);
        const start_time = formatDateString2(contest.start_time);
        const end_time = formatDateString2(contest.end_time);
        const display_start = formatDateString3(contest.start_time);
        const display_end = formatDateString3(contest.end_time);
        contest = { ...contest, start_time, end_time, display_start, display_end };
        if (startTime > now) {
            upcomingContests.push(contest);
        } else if (endTime < now) {
            endedContests.push(contest);
        } else {
            ongoingContests.push(contest);
        }
    });

    return { ongoingContests, upcomingContests, endedContests };
}
export { formatContest2, formatDateString, formatDateString2, getCurrentDate };

export default formatContest;