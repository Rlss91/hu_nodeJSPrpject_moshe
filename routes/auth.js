const Joi = require('joi');
const { User } = require('../models/users');
const authRouter = require('express').Router();
const bcrypt = require('bcrypt')



const authSchema = Joi.object({
    email: Joi.string().email().max(64).required(),
    password: Joi.string().min(6).max(1024).required(),
})

authRouter.post('/',async (req,res)=>{
    const validate = (body) => authSchema.validate(body);
    const {err} = validate(req.body);
    if(err)
    {return res.json({message: err.details.map(d => d.message)})}

    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).json({message: `invalid email or password`})
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (!isValid) {
        return res.status(400).json({
            message: `invalid email or password`
        })
    }

    res.json({
        token: user.generateToken()
    });



})



module.exports = authRouter