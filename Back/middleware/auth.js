
const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token,'d1d982fd-03ad-4f9b-ab58-70de11fc42ac')
        const userId = decodedToken.userId
        req.auth = {userId:userId}
        next()
    } catch (error){ res.status(401).json({error})
        }
}

