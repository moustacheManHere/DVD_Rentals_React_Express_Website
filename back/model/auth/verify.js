var db = require("../db")
var {secret} = require("./key")
var jwt = require("jsonwebtoken")
var f = {
    createToken(username,password,type,callback){
        // type can be customer or staff
        if(type == "customer"){
            var column = "email"
        } else {
            var column = "username"
        }
        var sql = `select * from ${type} where ${column} = "${username}" and password = "${password}"`
        var currentConnection = db.startConnection(); 
        // create connection to database
        currentConnection.connect(function(err){
            if (err){
                return callback(err,null);
            } 
            else { // query the database
                currentConnection.query(sql, function (err2,results2){
                    currentConnection.end() // end database connection and return result
                    if(err2){
                        return callback(err2,null)
                    } else {
                        if(results2.length==0){
                            
                            return callback(err2,1)
                        } else {
                            token=jwt.sign({userType:type,userId:results2[0][type+"_id"]},secret,{
                                expiresIn:86400
                            });
                            return callback(err2,token)
                        }
                    }                
                })
            }
        })
    },
    verify(req,res,next){
        if (!req.headers || !req.headers['authorization']) {
            return res.status(401).send('Unauthorized');
        }
        var token = req.headers['authorization']; //retrieve authorization header’s content
        if(!token || !token.includes('Bearer')){ //process the token
            res.status(401);
            res.send(JSON.stringify({"error_msg":"Not Authorised"}));
        }else{
            token=token.split('Bearer ')[1]; //obtain the token’s value
            jwt.verify(token,secret,function(err,decoded){//verify token
                if (err){
                    res.status(401);
                    res.send(JSON.stringify({auth:'false',message:'Not authorized!'}));
                }else{
                    if (decoded.exp <= Date.now() / 1000) {
                        res.status(401).send(JSON.stringify({ message: 'Token has expired' }));
                    } else {
                        req.userId = decoded.userId
                        req.userType = decoded.userType
                        next();
                    }
                }
            });
        }
    },
    checker : function(req,res){
        if (!req.headers || !req.headers['authorization']) {
            return res.status(401).send('Unauthorized');
        }
        var token = req.headers['authorization']; //retrieve authorization header’s content
        
        if(!token || !token.includes('Bearer')){ //process the token
            res.status(401);
            res.send(JSON.stringify({"error_msg":"Not Authorised"}));
        }else{
            token=token.split('Bearer ')[1]; //obtain the token’s value
            jwt.verify(token,secret,function(err,decoded){//verify token
                
                if (err){
                    res.status(401);
                    res.send(JSON.stringify({auth:'false',message:'Not authorized!'}));
                }else{
                    if (decoded.exp <= Date.now() / 1000) {
                        res.status(401).send(JSON.stringify({ message: 'Token has expired' }));
                    } else {
                        res.status(200).send(JSON.stringify({"type":decoded.userType}))
                    }
                }
            });
        }
    }
}




module.exports = f