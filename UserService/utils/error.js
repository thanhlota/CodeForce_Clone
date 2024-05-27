class ErrorHandler extends Error {
    status;
    message;
    constructor(status = 500, message = "Internal server error") {
        super(message);
        this.status = status;
    }

    httpResponse() {
        return res.status(this.status).send({
            message: this.message
        })
    }
}
module.exports = ErrorHandler;
