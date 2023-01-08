const express = require('express')
const app = express()
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


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
            title: 'naturo',
            year: 2019,
            price: 60
        }
    ]
}

app.get('/games',(req, res)=>{
    res.statusCode = 200;
    res.json(db.games)
})

app.get('/games/:id',(req, res)=>{
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
            res.send('objeto não encontrado')
        }
        

    }

   
})

app.post('/game',(req, res)=>{
    

    var { id,title, year, price} = req.body

    if(title != undefined && year != undefined && price != undefined){
        res.statusCode = 200

        db.games.push({
            id,
            title,
            year,
            price
    
        })
        res.statusCode = 200
    }else{
        res.statusCode = 400
    }

    
})


app.delete('/game/:id',(req, res)=>{

    var id = req.params.id
    if( isNaN(id)){
        res.statusCode = 400

    }else{
        var game = db.games.find( game => game.id == id)
        console.log(" game q foi encontrado "+ game.title)
        if(game.id != undefined){
            var gameId = game.id
            var gameIndex = db.games.findIndex(game => game.id  == gameId)
            console.log(gameIndex)
            db.games.splice(gameIndex,1)

            res.statusCode = 200
        }else{
            res.statusCode= 400
        }
    }
})








app.listen(3333,()=>{
    console.log(' apirodando')
})