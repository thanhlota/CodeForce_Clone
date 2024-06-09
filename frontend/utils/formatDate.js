import moment from 'moment-timezone';

const formatDate = (dateString) => {
    const date = moment(dateString).tz('Asia/Bangkok');
    const formattedDate = date.format('MMM/DD/YYYY HH:mm');
    const utc = 'UTC+7';
    return { formattedDate, utc };
};

export default formatDate;