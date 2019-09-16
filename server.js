const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient

const uri = "mongodb+srv://express:express@cluster0-h6nkv.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri, (err, client) => {
    if(err) return console.log(err)
    db = client.db("ine5612") // Nome do BD

    app.listen(3000, () => {
        console.log('server running on port 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/aluno', (req, res) => {
    res.render('index.ejs')
})

app.get('/aluno', (req, res) => {
    var cursor = db.collection('ronaldo').find()
})

app.get('/disciplina', (req, res) => {
    res.render('disciplina.ejs')
})

app.get('/disciplina', (req, res) => {
    var cursor = db.collection('romario').find()
})

app.post('/disciplinas', (req, res) => {
    var nome = req.body.name
    var codigo = req.body.codigo
    var horarios = req.body.horarios

    db.collection('romario').find().toArray((err, results) => {
        console.log(JSON.stringify(results))
      
        db.collection('romario').save(req.body, (err, result) => {
            if (err) return console.log(err) 
    
            console.log('Salvo no Banco de Dados')
        })
            
        res.redirect('/disciplinas')
    })
    
})

app.get('/disciplinas', (req, res) => {
    db.collection('romario').find().toArray((err, results) => {
        if (err) return console.log(err)
            res.render('showDisciplina.ejs', {data: results})
    })
})

app.post('/alunos', (req, res) => {
    var nome = req.body.name
    var matricula = req.body._id

    db.collection('ronaldo').find().toArray((err, results) => {
        console.log(JSON.stringify(results))
      
        db.collection('ronaldo').save(req.body, (err, result) => {
            if (err) return console.log(err) 
    
            console.log('Salvo no Banco de Dados')
        })
            
        res.redirect('/show')
    })
    
})

app.get('/alunos', (req, res) => {
    db.collection('ronaldo').find().toArray((err, results) => {
        if (err) return console.log(err)
            res.render('show.ejs', {data: results})
    })
})

// app.post('/show', (req, res) => {
//     var nome = req.body.name + " " + req.body.surname

//     db.collection('data').find().toArray((err, results) => {
//         console.log(JSON.stringify(results))
//         if (err) return console.log(err)
       
//         var jaExiste = false

//         for(i = 0; i < results.length; i++) {
//             console.log(results[i].name)

//             if (results[i].name + " " + results[i].surname == nome) {
//                 console.log("Usuário já cadastrado")
//                 jaExiste = true
//             }
//         }
//         if (!jaExiste) {
//         db.collection('data').save(req.body, (err, result) => {
//             if (err) return console.log(err) 
    
//             console.log('Salvo no Banco de Dados')
//         })
//     }
            
//         res.redirect('/show')
//     })
    
// })

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('ronaldo').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result })
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name

    db.collection('ronaldo').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de Dados')
    })
})
app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('ronaldo').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Deletando do Banco de Dados!')
        res.redirect('/show')
    })
})