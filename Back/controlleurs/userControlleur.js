const User = require('../models/userModel')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

exports.signup = (req,res,next) => {
    bcrypt.hash(req.body.password,10)
        .then(hash => {
            const newUser = new User({
                email : req.body.email,
                password : hash
            })
            newUser.save()
                .then(()=>res.status(200).json({message:'Utilisateur à bien été crée !'}))
                .catch(error=> res.status(400).json({error}))
        })
        .catch(error=> res.status(500).json({error}))
}

exports.login = (req,res,next) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user){
            return res.status(401).json({error:'Utilisateur introuvable'})
        }
        bcrypt.compare(req.body.password,user.password)
            .then(validPassword => {
                if (!validPassword){
                    return res.status(401).json({error:'Mot de passe incorrecte'})
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


