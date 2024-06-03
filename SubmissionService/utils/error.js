const ERROR = require("../enum/error");
class ErrorHandler extends Error {
    status;
    message;
    constructor(status = 500, message = "Internal server error") {
        super(message);
        this.message = message;
        this.status = status;
    }

    httpResponse(res) {
        return res.status(this.status).send({
            message: this.message
        })
    }
}
module.exports = {
    ErrorHandler,
    DefaultError: new ErrorHandler(ERROR.DEFAULT_SERVER_ERROR.status, ERROR.DEFAULT_SERVER_ERROR.message)
}
