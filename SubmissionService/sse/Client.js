class Client {
    id = "";
    response = null;
    submission_ids = [];

    constructor(id, submission_ids, response) {
        this.id = id;
        this.response = response;
        this.submission_ids = submission_ids;
    }
}

module.exports = Client