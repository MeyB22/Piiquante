
const Sauce = require('../models/sauceModel')

const {json} = require("express");
const fs = require('fs')

exports.getAllSauces = (req,res,next) => {
    Sauce.find().then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({error}))
}

exports.getOneSauce = (req,res,next) => {

    Sauce.findOne({_id:req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
}
//Creation d'une sauce
exports.createSauce = (req,res,next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const newSauce = new Sauce({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked : []
    })
        newSauce.save().then( ()=> res.status(201).json({message : "Sauce enregistrée ! "}))
            .catch(error => res.status(404).json({error}))
}
//Modifier une sauce
exports.modifyOneSauce = (req,res,next) => {
    Sauce.findOne({_id:req.params.id})
        .then((sauce) => {
            if(sauce.userId !== req.auth.userId){
                res.status(403).json({message:'Vous n\'avez pas le droit de supprimée cette sauce' })
            }
            const sauceObjet = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                }:{
                    ...req.body
                }
            Sauce.updateOne({_id:req.params.id},{...sauceObjet,_id:req.params.id})
                .then(() => res.status(201).json({message:"mise à jour de la sauce"}))
                .catch(error => res.status(403).json({error}))
        })
        .catch(error => res.status(404).json({error}))
}
//Supprimer une sauce
exports.deleteOneSauce = (req,res,next) => {
    Sauce.findOne({_id:req.params.id})
        .then((sauce) => {
            if(sauce.userId !== req.auth.userId){
                res.status(403).json({message:'Vous n\'avez pas le droit de supprimée cette sauce' })
            }
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`,() =>{
               Sauce.deleteOne({_id:req.params.id})
                   .then(() => res.status(200).json({message:"Sauce supprimée"}))
                   .catch(error => res.status(404).json({error}))
            })
        })
        .catch(error => res.status(404).json({error}))
}
//like
exports.likes = (req,res,next) => {
    Sauce.findOne({_id:req.params.id})
        .then((sauce) => {
           if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)){
              sauce.usersLiked.push(req.body.userId)
           }else if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId)){
               sauce.usersDisliked.push(req.body.userId)
           }else if (req.body.like === 0){
               if (sauce.usersLiked.includes(req.body.userId)){
                   const indexUserId = sauce.usersLiked.indexOf(req.body.userId)
                   sauce.usersLiked.splice(indexUserId,1)
               }
               if (sauce.usersDisliked.includes(req.body.userId)){
                   const indexDislikedUserId = sauce.usersDisliked.indexOf(req.body.userId)
                   sauce.usersDisliked.splice(indexDislikedUserId,1)
               }
           }
           sauce.likes = sauce.usersLiked.length
           sauce.dislikes = sauce.usersDisliked.length
            sauce.save()
                .then(() => res.status(200).json({message:"Mise à jour des Likes et Dislikes"}))
                .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(404).json({error}))
}