const { validationResult } = require("express-validator");
 
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

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    

    res.json({
        'statusCode': 200,
        'message': 'User signup successfully'
    });
}