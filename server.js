const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')


const db = knex ({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        port : 5431,
        user : 'daga',
        password :"blabla",
        database : 'test'
    }
});

(db.select('*')
    .from('users'))
    .then(data=>{
        console.log(data)
})

const app = express();
app.use(bodyParser.json());
app.use(cors())

database = {
    users: [
        {
            id: "1",
            name: "Daga",
            email: "gaga376@wp.pl",
            password: "a",
            entries: 0,
            joined: new Date()
        },
        {
            id: "12",
            name: "Adam",
            email: "Adam@wp.pl",
            password: "motyle",
            entries: 0,
            joined: new Date()
        },
    ], login:[
        {
            id: '199',
            hash: '',
            email: "gaga376@wp.pl"
        }
    ]
}

app.get("/", (req, res) => {
    res.send(database.users);
})

console.log('dczdvczdvz')

app.post("/signin", (req, res) => {
    if (req.body.email === database.users[0].email
        && req.body.password === database.users[0].password) {
        console.log("success")
      /*  res.json({'status': 'success'})*/
        res.json(database.users[0])
    } else {
        console.log('failure')
        res.status(400).json('upps no working')
    }
})

app.post("/register", (req, res) => {
    const {email, name, password} = req.body;

    const hash = bcrypt.hashSync(password);
    // create db.transaction if we have more than ones things
   // use this trx object instead of db to do this operations
    // insert data
    // into it login table
    // return the email
    // use a loginEmail to return another transaction
    // and to insert into it users
    // email - instead loginEmail, email instead of loginEmail[0].email,
    // also works
    //
    //then respond with a json()
    // if we want to add it to sql
    // need to trx transaction commit
    // if anything fails - function catch will rollback the changes


    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail =>{
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit) // trx.commit - put into it this data
            .catch(trx.rollback) // if anything change - rollback the changes
    })
        .catch(err => res.status(400).json("unable to register"))
})

app.get("/profile/:id", (req, res) => {
    const {id} = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length){
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
    })
        .catch(err=> res.status(400).json('error getting user'))
})

app.put("/image", (req,res)=>{
    const {id} = req.body;
   db('users').where('id', '=', id)
       .increment('entries',1)
       .returning('entries')
       .then(entries => {
           res.json(entries[0]);
       })
       .catch(err => res.status(400).json('unable to get entries'))
});

bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});


app.listen(3000, () => {
    console.log('app is running')
});