import jwt from 'jsonwebtoken';

const auth = async (req,res,next) => {
    try{
        const bh = req.headers['authorization'];
    if(typeof bh == 'undefined'){
        res.status(401).json({message: 'token not found'})
    }else{
        const token = bh.split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.token = user;
        next();
    }

    }catch(error){
        res.status(401).json({message: 'Expire or invalid token'});

    }
}

export default auth;