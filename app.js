const express = require("express");
var cors = require('cors')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const {eAdmin} = require('./middlewares/auth.js')
const User = require("./models/Usuario.js")

const app = express();

app.use(express.json());

app.use( (req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", ['GET', 'PUT', 'POST', 'DELETE'])
    //res.header("Access-Control-Allow-Headers ", [ 'X-PINGOTHER', 'Content-Type', 'Authorization'] )
    //res.header("Access-Control-Allow-Headers ", "X-PINGOTHER',Content-Type, Authorization" )
    app.use(cors());
    next()
})

app.get("/users", eAdmin, async (req, res) => {
    
    await User.findAll()
    .then( (users) => {
        return res.json({
            erro: false,
            users
        })
    }).catch( () => {
        return res.status(400).json({
            erro: true,
            mensagem: "Sem usuários"
        })
    } )
})

//http://localhost:3232/usuario/1
app.get("/user/:id", async (req, res) => {
    const { id } = req.params;

    const user = await User.findByPk(id)
    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Usuário Não Localizado"
        })

    } else {
        return res.json({
            erro: false,
            user
        })
    }

    
})

app.post("/user", async (req, res) => {
    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password,8)
    await User.create(req.body).
        then( () => {
        return res.json({
            erro: false,
            mensagem: "Usuário cadastrado com sucesso"
        })
    }).catch( () => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário nao cadastrado com sucesso"
        })
    } )

})

app.put("/user", async (req, res) => {
    const { id, name, email } = req.body

    const user = await User.findByPk(id)
    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Usuário Não Localizado"
        })

    } else {
        await user.update({ name , email }, {
            where: {
              id: id
            }
          });
          return res.json({
            erro: false,
            user : await User.findByPk(id)
        })
    }


})

app.put("/user-password", async (req, res) => {
    var { password, id } = req.body
    password = await bcrypt.hash(password,8)
    const user = await User.findByPk(id)
    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Usuário Não Localizado"
        })

    } else {
        await user.update({ password }, {
            where: {
              id: id
            }
          });
          return res.json({
            erro: false,
            user : await User.findByPk(id)
        })
    }


})

app.delete("/usuario/:id", async (req, res) => {
    const { id} = req.params;
    const user = await User.findByPk(id)
    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Usuário Não Localizado"
        })

    } else {
        await user.destroy( {
            where: {
              id: id
            }
          });
          return res.json({
            erro: false,
            mensagem: "Usuário Deletado"
        })
    }
})

app.post("/login", async (req,res) => {
    const user = await User.findOne( { 
        attributes: [ 'id', 'name', 'email', 'password' ],
        where: {email: req.body.email} } )
    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Usuário Não Localizado"
        })
    }

    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro : Senha invalida"
        })
    }

    const token = jwt.sign( { id: user.id }, process.env.SECRET , {expiresIn: 600 } )
    return res.json({
        erro: false,
        mensagem: "Usuário Localizado",
        token
    })

    
    
})

app.get("/val-token", eAdmin, async (req, res) => {
    await User.findByPk(req.userId)
    .then((user) => {
        return res.json({
            erro: false,
            mensagem: "Token Valido",
            token
        })
    }).catch( ()=> {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro : Necessário Realizar Login"
        })
    } )

})
/*
async function validarToken(req, res,next ){
    //return res.json( { message: "Token Valido" } )
    const authHeader = req.headers.authorization;
    const [bearer, token ] = authHeader.split(' ');
    if(!token){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro autenticação"
        })
    }

    try {
        const decoded = await promisify(jwt.verify)(token,'mnoiQPwM4rZasdasdAAAAaaa111111222');
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
*/
//Servidor iniciado na Porta 3232
app.listen(3232, () => {
    console.log("Servidor iniciado na porta http://localhost:3232/ ")
})