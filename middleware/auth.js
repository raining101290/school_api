const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_token);
        const { username, userId } = decoded;
        req.username = username;
        req.userId = userId;
        next();
    }
    catch
    {
       // console.log(err);
        next("Authentication failure !");
    }
};
module.exports = auth;