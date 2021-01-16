class ErrorHandler extends Error{
    constructor(massage, statusCode){
        super(massage);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorHandler;