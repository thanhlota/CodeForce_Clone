const ERROR = {
    DEFAULT_SERVER_ERROR: {
        status: 500,
        message: "Internal server error"
    },
    MISSING_RANKING_INFO: {
        status: 400,
        message: "Missing ranking info"
    },
    MISSING_SUBMISSION_INFO: {
        status: 400,
        message: "Missing submission info"
    },
    NON_EXISTED_RANKING: {
        status: 404,
        message: "Ranking is not existed"
    },
}
module.exports = ERROR;