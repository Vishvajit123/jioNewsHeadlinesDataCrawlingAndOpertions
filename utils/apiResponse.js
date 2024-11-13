//utils/apiResponse.js


const sendResponse = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({
        message,
        data
    });
};

export { sendResponse };
