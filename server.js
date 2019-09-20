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

app.get('/', (req, res) => {
    res.render('home.ejs')
})

//ALUNOS


app.get('/aluno', (req, res) => {
    res.render('aluno.ejs')
})

app.get('/aluno', (req, res) => {
    var cursor = db.collection('alunosLL').find()
})

app.post('/alunos', (req, res) => {
    var nome = req.body.name
    var matricula = req.body.numMatricula
    var disponivel = true

    db.collection('alunosLL').find().toArray((err, results) => {
        console.log(JSON.stringify(results))

        for(i = 0; i < results.length; i++) {
            if (results[i].numMatricula == matricula) {
                disponivel = false
            }
        }
        
        if(disponivel) {
        db.collection('alunosLL').save(req.body, (err, result) => {
            if (err) return console.log(err) 
            console.log('Salvo no Banco de Dados')
            res.redirect('/alunos')
        })
        } else {
            console.log('Aluno já cadastrado');
            res.redirect('/aluno')
        }
    })
})

app.get('/alunos', (req, res) => {
    db.collection('alunosLL').find().toArray((err, results) => {
        if (err) return console.log(err)
            res.render('showAluno.ejs', {data: results})
    })
})


app.route('/aluno/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('alunosLL').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('editAluno.ejs', { data: result })
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name

    db.collection('alunosLL').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/alunos')
        console.log('Atualizado no Banco de Dados')
    })
})
app.route('/aluno/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('alunosLL').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Deletando do Banco de Dados!')
        res.redirect('/alunos')
    })
})

app.route('aluno/:id/disciplinas')
.get((req, res) => {
    var id = req.params.id
})
// Disciplinass

app.get('/disciplina', (req, res) => {
    res.render('disciplina.ejs')
})

app.get('/disciplina', (req, res) => {
    var cursor = db.collection('disciplinasLL').find()
})

app.post('/disciplinas', (req, res) => {
    var nome = req.body.name
    var codigo = req.body.codigo
    var horarios = req.body.horarios
    var disponivel = true

    db.collection('disciplinasLL').find().toArray((err, results) => {
        // console.log(JSON.stringify(results))
        for (let i = 0; i < results.length; i++) {
            if(results[i].codigo == codigo) {
                disponivel = false
            }
        }
        
        if (disponivel) {
        db.collection('disciplinasLL').save(req.body, (err, result) => {
            if (err) return console.log(err)
            console.log('Salvo no Banco de Dados')
            res.redirect('/disciplinas')
        
        })
    } else {
        console.log("Disciplina com esse código já cadastrada")
        res.redirect('/disciplina')
    } 
        
    })
    
})

app.get('/disciplinas', (req, res) => {
    db.collection('disciplinasLL').find().toArray((err, results) => {
        if (err) return console.log(err)
            res.render('showDisciplina.ejs', {data: results})
    })
})

app.route('/disciplina/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('disciplinasLL').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('editDisciplina.ejs', { data: result })
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var horarios = req.body.horarios

    db.collection('disciplinasLL').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            horarios : horarios,
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/disciplinas')
        console.log('Atualizado no Banco de Dados')
    })
})
app.route('/disciplina/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('disciplinasLL').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Deletando do Banco de Dados!')
        res.redirect('/disciplinas')
    })
})

// Matriculas

app.get('/matricula', (req, res) => {
    res.render('matricula.ejs')
})

app.get('/matricula', (req, res) => {
    var cursor = db.collection('matriculasLL').find()
})


app.post('/matriculas', (req, res) => {
    var matricula = req.body.numMatricula
    var codigo = req.body.codigo

    db.collection('disciplinasLL').find().toArray((err, results) => {
        for (let i = 0; i < results.length; i++) {
            if (results[i].codigo == codigo) {

                db.collection('alunosLL').find().toArray((err, result) => {
                    for (let j = 0; j < result.length; j++) {
                        
                    if (result[j].numMatricula == matricula) {
                        db.collection('matriculasLL').save(req.body, (err, results) => {
                            console.log('Disciplina cadastrada')
                            res.redirect('/alunos')
                        })
                    } 
                }
            })
            }
        }
    })


    
})

app.route('/matriculas/:id')
.get((req, res) => {
    var id = req.params.id
    var matriculas = []
    db.collection('alunosLL').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        db.collection('matriculasLL').find().toArray((err, results) => {
            for (let i = 0; i < results.length; i++) {
                if (results[i].numMatricula == result[0].numMatricula) {
                    console.log(results[i])
                    matriculas.push(results[i])
                    console.log("depois aqui")
                    console.log(matriculas)
                }
            }
            res.render('showAlunoDisciplina.ejs', {data: matriculas})

        })
        // res.render('editDisciplina.ejs', { data: result })
  

    })
})
app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('matriculasLL').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Deletando do Banco de Dados!')
        res.redirect('/alunos')
    })
})

