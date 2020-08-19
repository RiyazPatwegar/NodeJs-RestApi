const express = require("express");
const { body } = require("express-validator");
const singupController = require("../controllers/signup");

const router = express.Router();

router.post('/signup',[
    body('name').
        trim().
        not().isEmpty().escape().
        isLength({min: 5}, {max: 15}).
        withMessage('Invalid name value'),
    body('email').
        trim().
        not().isEmpty().
        isLength({min: 5},{max: 30}).
        isEmail().
        normalizeEmail().
        withMessage('Invalid email address'),
    body('password').
        trim().
        not().isEmpty().
        isLength({min: 4}, {max: 15}).
        withMessage('Invalid password value'),
    body('confirm').        
        custom((value, {req}) =>{
            if(value !== req.body.password){
                return Promise.reject('Password confirm field does not matched');
            }else{
                return true;
            }
        })
],singupController.signUp);

router.post('/login', [
    body('email').
        trim().not().isEmpty().
        isEmail().
        escape().
        isLength({min: 5}, {max: 30}),
    body('password').
        trim().not().isEmpty().
        isLength({min:4, max:15})
], singupController.login);

module.exports = router;