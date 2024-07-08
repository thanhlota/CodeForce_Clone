import moment from 'moment-timezone';

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const offset = -new Date().getTimezoneOffset() / 60;
const formatDate = (dateString) => {
    const date = moment(dateString).tz(timezone);
    const formattedDate = date.format('MMM/DD/YYYY HH:mm');
    const utc = `UTC+${offset}`;
    return { formattedDate, utc };
};

export default formatDate;