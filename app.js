const express = require("express");
const User = require("./models/Usuario.js")

const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
    
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
    const { name, email } = req.body;
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


//Servidor iniciado na Porta 3232
app.listen(3232, () => {
    console.log("Servidor iniciado na porta http://localhost:3232/ ")
})