const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected',(req,res)=>{
    res.send('in the router')
})

router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body
    if(!name || !email || !password){
       return res.status(422).json({error:"All Fields are mandotory"})
    }
    // res.json(message="Signup Successfully")
    User.findOne({email:email}).then((AlreadUser)=>{
        if(AlreadUser){
            return res.status(422).json({error:"User is already exist with this email"})
        }

        bcrypt.hash(password,12).then(hashedpassword=>{

            const user = new User({name,email,password:hashedpassword,pic})

        user.save().then(user=>{
            res.json({message:"Signup Successfully"})
        })
        .catch(err=>{
            console.log(err)
        })

        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Fields are empty"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Email or Password is Invalid"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(passMatch=>{
            if(!passMatch){
                return res.status(422).json({error:"Email or Password is Invalid"})
            }
            // res.json({message:"Signin Successfully"})
            const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
            const {_id,name,email,followers,following,pic} = savedUser
            res.json({token,user:{_id,name,email,followers,following,pic}})
        })
        .catch(err=>{console.log(err)})
    })
    .catch(err=>{console.log(err)})
})

module.exports = router