const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

/*
import isPortReachable from 'is-port-reachable';
console.log(await isPortReachable(80, {host: 'google.com'}));
*/

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
    const {email, name, password} = req.body

    bcrypt.hash(password, null, null, function(err, hash) {
       console.log(hash)
    });

    database.users.push({
        id: "123",
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1]);
})

app.get("/profile/:id", (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });
    if (!found){
        res.status(404).json("not found");
    }
})

app.put("/image", (req,res)=>{
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries ++;
            return res.json(user.entries);
        }
    });
    if (!found){
        res.status(404).json("not found");
    }
});

bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});


app.listen(3000, () => {
    console.log('app is running')
});