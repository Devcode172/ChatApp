import jwt from 'jsonwebtoken'
export const isAuthenticated = (req, res, next) => {

    const token  = req.cookies.token || req.headers['authorization']?.split(' ')[1]
    if(!token){
        return res.status(401).json({
            message : 'Unauthorized Access'
        })
    }else{
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Unauthorized Access'
                })
            }
            req.user = decoded.username
            console.log('tokendata',decoded)
            next()
         })

    }
}