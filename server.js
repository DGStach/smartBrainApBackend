const express = require("express");
const bodyParser = require ("body-parser");

const app = express();
app.use(bodyParser.json())

const database = {
    users: [
        {
            id: '1234',
            name: 'John',
            email: "john@gmail.com",
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '123',
            name: 'Sally',
            email: "sally@gmail.com",
            password: 'Sally',
            entries: 0,
            joined: new Date()
        }
    ]
}
app.get("/", (req, res) => {
    res.send(database.users);
})

app.post("/signin", (req, res) => {
    if (req.body.email === database.users[0].email
        && req.body.password === database.users[0].password ){
res.json('succes')
    } else  {res.status(400).json('error login in')}
})

app.post("/register", (req, res)=>{
    const {email, name, password} = req.body
    database.users.push({
        id: '1235',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1])
})

app.listen(3000, () => {
    console.log("app run on port 3000")
})

