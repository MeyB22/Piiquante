const User = require('../models/userModel')

const validator = require("email-validator");

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

//Inscription
exports.signup = (req,res,next) => {
        if (validator.validate(req.body.email) === false){
            res.status(403).json({message:"Votre email n'est pas valide"})
        }
        bcrypt.hash(req.body.password,10)
        .then(hash => {
            const newUser = new User({
                email : req.body.email,
                password : hash
            })
            newUser.save()
                .then(()=>res.status(200).json({message:'Utilisateur a bien été créé !'}))
                .catch(error=> res.status(400).json({error}))
        })
        .catch(error=> res.status(500).json({error}))
}
//Conexion
exports.login = (req,res,next) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user){
            return res.status(401).json({error:'Utilisateur ou  mot de passe incorrecte'})
        }
        bcrypt.compare(req.body.password,user.password)
            .then(validPassword => {
                if (!validPassword){
                    return res.status(401).json({error:'Utilisateur ou  mot de passe incorrecte'})
                }
                res.status(200).json({
                    userId : user._id,
                    token : jwt.sign(
                        {userId:user._id},
                        process.env.TOKEN,
                        {expiresIn : '24h'}
                    )

                })
            }).catch(error=> res.status(500).json({error}))
    }).catch(error=> res.status(500).json({error}))
}


