const bcrypt = require("bcrypt-nodejs");

const handleRegister = (db ,bcrypt)=>
(req, res) => {

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

    const {email, name, password} = req.body;
    if (!email || !name || !password){
        return res.status(400).json('incorrect form submission')
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
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
}
module.exports = {handleRegister: handleRegister}