const { validationResult } = require("express-validator");
const db = require("../util/database");
const bcrypt = require("bcryptjs");

exports.signUp = (req, res, next) => {
    console.log(req.body);

    const error = validationResult(req);
    if(!error.isEmpty()){
        const errors = new Error("Validation failed");
        errors.statusCode = 401;
        errors.data = error.array();
        throw errors;
        //return res.json({'statusCode':401, 'message':'Validation failed', 'data': error.array()});
    }

    const name = req.body.name.trim();
    const email = req.body.email.trim();
    const password = req.body.password.trim();    
    
    db.execute("SELECT email FROM users where email = '"+email+"' ").
    then((row, second) => {
        console.log(row[0]);
        
        if(row[0].length > 0){
            res.json({
                'statusCode': 401,
                'message': 'Email id already exists'
            });    
        }else{

            bcrypt.hash(password, 12).then((passwordHash) => {
                db.execute("INSERT INTO users (name, email, password) values ('"+name+"', '"+email+"', '"+passwordHash+"') ");
                res.json({
                    'statusCode': 200,
                    'message': 'User signup successfully'
                });
            }).
            catch((err)=> {
                console.log(err);
                const error = new Error("Signup failed, please try again!");
                error.statusCode = 400;
                next(error);        
            });            
        }
    }).catch((err)=>{
        console.log(err);
        const error = new Error("Something went wrong, please try again!");
        error.statusCode = 400;
        next(error);
    });    
}

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        console.log('Validation failed!');
        const error = new Error("Validation failed!");
        error.statusCode = 401;
        error.data = errors.array();
        next(error);
    }else{
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;
        
            db.execute("SELECT id,name,password FROM users where email='"+email+"' ").
            then((row, secondayData) => {
                
                console.log(row[0][0]);
                
                if(row[0].length !== 1){
                    res.status(400).json({statusCode: 400, message: 'Login failed, No user found!'});
                }else{
                    
                    bcrypt.compare(password, row[0][0].password).then((isEqual) => {
                        console.log(isEqual);
                        if(isEqual){
                            res.status(200).json({statusCode: 200, message: 'Login successfull, Welcome user '+row[0][0].name});
                        }else{
                            
                            const error = new Error("Login failed, Password doesn't matched!");
                            error.statusCode = 400;
                            error.data = [{location: [{controller:'signup', method: 'login'}]}];
                            next(error);            
                        }
                    }).catch((err)=>{
                        console.log(err);                
                        const error = new Error("Login failed, Password doesn't matched!");
                        error.statusCode = 400;
                        error.data = [{location: [{controller:'signup', method: 'login'}]}];
                        next(error);
                    });                                        
                }                
            }).            
        catch((err) => {
            console.log(err);                
            const error = new Error("something went wrong, please try again!");
            error.statusCode = 400;
            error.data = [{location: [{controller:'signup', method: 'login'}]}];
            next(error);
        });
    }
}