const bcrypt = require("bcrypt-nodejs");
const handleSignin = (db,bcrypt)=> (req,res) => {

    console.log("inside fun handleSignin")
    let a = new Date();
    const {email, password} = req.body;

    if (!email || !password){
        return res.status(400).json('incorrect form submission')
        console.log("inside fun handleSignin first IF ")
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            console.log("inside fun handleSign db before first if  ")
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong password or email')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))

    let b = new Date();
        console.log("Signin duration  before catch db", a-b)

    console.log("END fun handleSignin")
}

module.exports = {handleSignin: handleSignin}
