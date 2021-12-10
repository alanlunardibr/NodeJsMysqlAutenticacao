const jwt = require('jsonwebtoken');
const { promisify } = require('util');
require('dotenv').config();

module.exports = {
    eAdmin: async function validarToken(req, res,next ){
        //return res.json( { message: "Token Valido" } )
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro autenticação"
            })
        }
        const [bearer, token ] = authHeader.split(' ');
        try {
            const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
            req.userId=  decoded.id;
        
            return next();
        
        } catch (err) {
            return res.status(401).json({
                erro: true,
                mensagem: err
            })
        }
        
        return res.json( {"mensagem": token} )
        return next();
    }
};