const jwt = require("jsonwebtoken");
const JWT_SECRET = "shubhamisagoodb$oy";

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({error: "Please provide a token to get authorised access"});
    } else {
        try {
            const data = jwt.verify(token, JWT_SECRET);
            req.user = data.user;
            next();
        } catch (error) {
            console.log(token);
            res.status(401).send({error: "Please authenticate using a valid token. " + error});
        }
    }
}

module.exports = fetchuser