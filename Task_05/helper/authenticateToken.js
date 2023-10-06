const jwt = require('jsonwebtoken');
const { successHandler, errorHandler } = require('../helper/responseHandler');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        if (!token || token == null) {
            return errorHandler(res, 401, 'authenticate_token_error', 'Token missing.');
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return errorHandler(res, 401, 'authenticate_token_error', 'Invalid token');
            } else {
                const dynamicId = req.params.id;
                const unrestrictedRoute = '/getUser/:id';
                console.log(unrestrictedRoute);
                console.log(req.path);
                if (req.path === unrestrictedRoute.replace(':id', dynamicId)) {
                    if (decoded.role === 'admin' || decoded.id == dynamicId) {
                        req.user = decoded;
                        next();
                    } else {
                        return errorHandler(res, 403, 'authenticate_token_error', 'Access denied: User can access his details only.')
                    }
                }
                else if (decoded.role === 'admin') {
                    req.user = decoded;
                    next();
                } 
                else {
                    return errorHandler(res, 403, 'authenticate_token_error', 'Access denied!');
                }
            }
        })
    } catch (error) {
        if (error.code === 500) {
            return errorHandler(res, 500, 'server_error', error.message);
        } else {
            return errorHandler(res, 409, 'authenticate_token_error', error.message);
        }
    }
}

module.exports = { authenticateToken }