const express = require('express')

const router = express.Router()

const sauceControlleur = require('../controlleurs/sauceController')

const auth = require("../middleware/auth")

const multer = require("../middleware/multer-config")

router.get('/',auth,sauceControlleur.getAllSauces)

router.get('/:id',auth,sauceControlleur.getOneSauce)

router.post('/',auth,multer,sauceControlleur.createSauce)

router.put('/:id',auth,multer,sauceControlleur.modifyOneSauce)

router.delete("/:id",auth,sauceControlleur.deleteOneSauce)

router.post("/:id/like",auth,sauceControlleur.likes)

module.exports = router

