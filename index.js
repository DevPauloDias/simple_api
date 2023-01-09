const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')


const jwtSecret = "123654789"

app.use(cors())



app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

function auth(req, res, next){
    const authToken = req.headers['authorization'];

    if(authToken != undefined){
        var bearer = authToken.split(' ')
        var token = bearer[1];
       
        jwt.verify(token, jwtSecret,(err, data)=>{
            if(err){
                res.status(401);
                res.json({ err: 'Token inválido!'})
            }else{
               
                req.token = token;
                req.loggedUser = { id: data.id, email: data.email}
                res.status(200)
                next()
            }

        })        
        

    }else{
        res.status(401)
        res.json({ err: 'Token inválido!'})
    }


    

}


var db ={
    games: [
        {
            id: 23,
            title: 'Call of Duty',
            year: 2019,
            price: 60
        },
        {
            id: 20,
            title: 'Gta SanAndreas',
            year: 2010,
            price: 40
        },
        {
            id: 21,
            title: 'Naruto',
            year: 2019,
            price: 60
        }
    ],
    users: [
        {
            id: 1,
            name: "Paulo Dias",
            email: "paulo@teste.com",
            password: "123"
        },
        {
            id: 2,
            name: "Patrick",
            email: "patrick@teste.com",
            password: "123"
        }
    ]
}

// Rotas games -------------------------------------------------------------

app.get('/games',auth,(req, res)=>{

    res.statusCode = 200;
    res.json(db.games)
})

app.get('/game/:id',(req, res)=>{
    var id = req.params.id

    if(isNaN(id)){
        res.statusCode= 400
        res.send("erro, valor informado na rota não é numérico")
    }else{
        var game = db.games.find(game => game.id == id )

        if(game != undefined){
            res.statusCode = 200;
            res.json(game)
        }else{
            res.statusCode = 404;
            res.send()
        }
        

    }

   
})

app.post('/game',auth,(req, res)=>{
    

    var { title, year, price} = req.body
    var id = 40

    if(title != undefined && year != undefined && price != undefined){
        res.statusCode = 200
        res.send('Game criado')

        db.games.push({
            id,
            title,
            year,
            price
    
        })
        
       
    }else{
        console.log('não cadastrou, campos incompletos')
        res.statusCode = 400
        res.send()
    }

    
})


app.delete('/game/:id',(req, res)=>{

    var id = req.params.id
    if( isNaN(id)){
        res.statusCode = 400
        res.send()

    }else{
        var game = db.games.find( game => game.id == id)
        console.log(" game q foi encontrado "+ game.title)
        if(game.id != undefined){
            var gameId = game.id
            var gameIndex = db.games.findIndex(game => game.id  == gameId)
            console.log(gameIndex)
            db.games.splice(gameIndex,1)

            res.statusCode = 200
            res.send()
        }else{
            res.statusCode= 400
            res.send()
        }
    }
})


app.put('/game/:id',(req, res)=>{

    var id = req.params.id
    if( isNaN(id)){
        res.statusCode = 400
        res.send()       


    }else{
        var game = db.games.find( game => game.id == id)
        console.log(" game q foi encontrado "+ game.title)

        if(game.id != undefined){
            var { title, year, price} = req.body

            if(title != undefined && title != ""){
                game.title = title
            }
            if(year != undefined && year != ""){
                game.year = year
            }

            if(price != undefined && price != ""){
                game.price = price
            }
            res.statusCode = 200
            res.send('ok')

        }else{
            res.statusCode = 400
            res.send()
        }
    }
})
// ---------------------------------------------------
// Rotas Usuarios

app.post('/auth', (req, res)=>{
    var {email, password} = req.body;

    if(email != undefined && email!= "" && password!= undefined && password!= ""){

        if(password != undefined && password != ""){
           var user= db.users.find( user => user.email == email && user.password == password)
            if(user!= undefined){
                jwt.sign({ id: user.id, email: user.email}, jwtSecret, {expiresIn:"48h"},(err, token)=>{
                    if(err){
                        res.status(400)
                        res.json({ err: 'falha interna'})
                    }else{
                        res.statusCode = 200
                        res.json({token: token});

                    }
                })
                
            }else{
                console.log(' Usuário não encontrado')
                res.status(401)
                res.json({err: "credenciais inválidas"})
            }
        }

    }else{
        res.status(400) 
        res.json(' O email enviado é inválido')
     }

})


app.listen(3333,()=>{
    console.log(' apirodando')
})