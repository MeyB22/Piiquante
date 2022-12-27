const express = require('express')

const router = express.Router()

const userControlleur = require('../controlleurs/userControlleur')

const passwordValidator = require('../middleware/passwordValidator')


router.post("/signup",passwordValidator,userControlleur.signup)

router.post("/login",userControlleur.login)


module.exports = router