const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy
const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // Your local passport file

let generateJWTToken = (user) => {    
        return jwt.sign(user, jwtSecret,        
        {        
        subject: user.Username, // This is the username you’re encoding in the JWT
        expiresIn: '7d', // This specifies that the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
        }
    );
}

/* POST login */
/**
 * POST /login - Handle user authentication and login.
 *
 * This endpoint is used to authenticate a user by checking their credentials
 * and returning a JSON Web Token (JWT) upon successful authentication.
 *
 * @function
 * @name POST /login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Object} router - Express router object.
 * @returns {Object} - The JSON response containing user information and a JWT.
 *
 * @example
 * // Request
 * POST /login
 * {
 *   "Username": "example_user",
 *   "Password": "example_password"
 * }
 *
 * // Response (Success)
 * {
 *   "user": {
 *     "_id": "user_id",
 *     "Username": "example_user",
 *     "Password": "hashed_password",
 *     "Email": "user_email"
 *     "Birthday": null,
       "FavoriteMovies": [],
       "__v": 0
 *   },
 *   "token": "generated_jwt_token"
 * }
 *
 * // Response (Error)
 * {
 *   "message": "Something is not right",
 *   "user": null
 * }
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                })
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }                
                // let userMicro = { Username: user.Username, Email: user.Email, _id: user._id };
                // let token = generateJWTToken(userMicro); // The reduced payload here
                // return res.json({ userMicro, token });

                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}



