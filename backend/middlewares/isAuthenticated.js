import jwt from 'jsonwebtoken'; 

const isAuthenticated = async(req, res, next) =>{
    try {
        const token = req.cookies.horizon_token;
        
        if(!token) {
            return res.status(400).json({message:"User not authenticated!", success:false});
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode) {
            return res.status(400).json({message:"Invalid token!", success:false});
        }
        req.id = decode.userId;        //saved the userId in a variable id in req
        next();
    } catch (error) {
        console.log(error);
        
    }
}

export default isAuthenticated;