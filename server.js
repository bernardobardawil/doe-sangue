//configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos extras(no caso aqui são os estáticos)
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({extended: true}))


//Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'salamanca',
    host: 'localhost',
    port: '5432',
    database: 'doe'

})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, //Não quero que ele faça cache - boolean ou booleano - só aceitam dois valores verdadeiro ou falso
})


//configurar a apresentação da página ou rotas
server.get("/", function(req, res){
    //fazendo funcionar o index.html - trocamos o send pelo "render, que significa criar"
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

})


server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood


    //regra de negócio
    //Se o name igual a vazio
    //se email igual a vazio
    //se o blood for igual a vazio
    if(name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")

    }

    //coloco valores dentro do banco de dados
    const query = `
    INSERT INTO donors("name", "email", "blood")
     VALUES($1, $2, $3)`

     const values = [name, email, blood]


    db.query(query, values, function(err){

        //fluxo de erro
        if (err) return res.send("erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")

    })
    
  
})

//ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log("iniciei o servidor.")
})