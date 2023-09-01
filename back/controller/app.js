// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01

// Import Modules
var bodyParser = require('body-parser');
var app = require('express')();
var _ = require("lodash")
var cors = require("cors")

// Import model 
var get = require("../model/api/get")
var post = require("../model/api/post")
var put = require("../model/api/update")
var remove = require("../model/api/remove")

// Auth files
var {verify} = require("../model/auth/verify")
var {createToken} = require("../model/auth/verify")
var {checker} = require("../model/auth/verify")

// Parsing middleware
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
app.use(cors())

// Automate Function
app.autoSend = function(res,status,messageObj){
    res.status(status);
    res.type("json")
    res.send(JSON.stringify(messageObj))
}

// Authentication
app.post("/createToken",function(req,res){
    if(req.body.username){
        var type = "staff"
    } else if(req.body.email){
        var type = "customer"
    } else {
        app.autoSend(res,500,{"error_msg":"internal server error"})
        
        return 1
    }
    var username = req.body.username || req.body.email
    var password = req.body.password 
    
    createToken(username,password,type,function(err,result){
        if(err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"internal server error"})
        } else {
            if(result==1){
                app.autoSend(res,401,{"error":"unauthorised"})
                return 1;
            }
            app.autoSend(res,200,{"token":result,"type":type})
        }
    })
})
app.get("/checkValid",(req,res)=>{
    checker(req,res)
})

// POST Requests (Admins)

app.post("/addActor",verify,(req,res)=>{
    if(req.userType != "staff"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }
    
    var firstName = req.body.first_name 
    var lastName = req.body.last_name 
    
    if (!(firstName&&lastName)){ // if either one is undefined it will run
        app.autoSend(res,400,{"error_msg" : "missing data"})
    } else {
        post.addActor(firstName,lastName,(err,results)=>{
            if(err){
                app.autoSend(res,500,{"error_msg":"Internal server error"})
                return 1
            } 
            app.autoSend(res,201,{"actor_id":results["insertId"].toString()})
        })
    }
})
app.post("/addCustomerAsAdmin",verify,(req,res)=>{
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    var addressLine1 = req.body.address.address;
    var district = req.body.address.district;
    var city_id = req.body.address.city_id;
    var phone = req.body.address.phone;

    if (!(first_name && last_name && email && addressLine1 && district && city_id && phone)){ 
        // only the values that cannot be null as per the db setting
        app.autoSend(res,400,{"error_msg" : "missing data"})
        return 1
    } 
    // security first
    if(req.userType != "staff"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }
    // check if email exists
    get.checkEmailExists(email,(err,results)=>{
        if(err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1;
        } 
        if(results.length > 0) {
            app.autoSend(res,409,{ "error_msg": "email already exist"})
            return 1;
        } 
        post.addAddress(Object.keys(req.body.address),Object.values(req.body.address),(err1,results1)=>{
            if(err1){
                console.log(err1)
                app.autoSend(res,500,{"error_msg":"Internal server error"})
                return 1
            }
            var addressID = results1.insertId
            post.addCustomer(first_name,last_name,email,addressID,password,(err2,results2)=>{
                if(err2 || results2.affectedRows<0){
                    console.log(err2)
                    remove.removeAddress(addressID,(err3,result3)=>{
                        if(err3){
                            console.log(err3)
                            app.autoSend(res,500,{"error_msg":"too many errors, contact admin"})
                            return 1
                        } else {
                            app.autoSend(res,500,{"error_msg":"internal server error"})
                            return 1
                        }
                    })                 
                }  else{
                    
                    app.autoSend(res,200,{"token":"Success!"})
                }   
            }) 
        })
    })
}) 

// POST Requests (Users)

app.post("/addCustomerAsUser",(req,res)=>{
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    var addressLine1 = req.body.address.address;
    var district = req.body.address.district;
    var city_id = req.body.address.city_id;
    var phone = req.body.address.phone;

    if (!(first_name && last_name && email && password && addressLine1 && district && city_id && phone)){ 
        // only the values that cannot be null as per the db setting
        app.autoSend(res,400,{"error_msg" : "missing data"})
        return 1
    } 
  
    // check if email exists
    get.checkEmailExists(email,(err,results)=>{
        if(err){
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            console.log(err)
            return 1;
        } 
        if(results.length > 0) {
            console.log(111)
            app.autoSend(res,409,{ "error_msg": "email already exist"})
            return 1;
        } 
        post.addAddress(Object.keys(req.body.address),Object.values(req.body.address),(err1,results1)=>{
            if(err1){
                console.log(err1)
                app.autoSend(res,500,{"error_msg":"Internal server error"})
                return 1
            }
            var addressID = results1.insertId
            post.addCustomer(first_name,last_name,email,addressID,password,(err2,results2)=>{
                if(err2){
                    console.log(err2)
                    remove.removeAddress(addressID,(err3,result3)=>{
                        if(err3){
                            console.log(err3)
                            app.autoSend(res,500,{"error_msg":"too many errors, contact admin"})
                            return 1
                        } else {
                            app.autoSend(res,500,{"error_msg":"internal server error"})
                            return 1
                        }
                    })                 
                }  else {
                    createToken(email,password,"customer",function(err,result){
                        if(err){
                            console.log(err)
                            app.autoSend(res,500,{"error_msg":"internal server error"})
                        } else {
                            if(result==1){
                                app.autoSend(res,401,{"error":"unauthorised"})
                                return 1;
                            }
                            app.autoSend(res,200,{"token":result,"type":"customer"})
                        }
                    })
                }
            }) 
        })
    })
})
app.post("/addReview",verify,(req,res)=>{
    var film_id = req.body.film_id
    var rating = req.body.rating
    var review = req.body.review
    // only those who buy can review

    // security first
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }

    // check if got buy
    get.checkFilmBought(req.userId,film_id,(err1,result1)=>{
        if (err1){
            console.log(err1)
            app.autoSend(res,500,{"err_msg":"internal server error"})
        } else if(result1.length==0){
            app.autoSend(res,407,{"err_msg":"never purchase"})
        } else {
            // add to table
            post.addReview(req.userId,film_id,rating,review,(err,result)=>{
                if(err){
                    app.autoSend(res,500,{"err_msg":"internal server error"})
                } else {
                    if(result.affectedRows == 1){
                        app.autoSend(res,201,{"success_msg":"record updated"})
                    } else {
                        app.autoSend(res,500,{"err_msg":"internal server error"})
                    }
                }
            })    
        }
    })

    
})
app.post("/addPayment",verify,(req,res)=>{
    var cust_id = req.userId
    var film_id = req.body.film_id
    var daysOfRental = req.body.rentalDays

    // security first
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }

    // delivery will be 2 days later so rental will start then
    const currentDate = new Date();
    const twoDaysLater = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000));
    const returnDaysLater = new Date(currentDate.getTime() + (daysOfRental * 24 * 60 * 60 * 1000));
    const rental_date = twoDaysLater.toISOString().slice(0, 19).replace('T', ' ');
    const return_date = returnDaysLater.toISOString().slice(0, 19).replace('T', ' ');
    const today_date = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // check if item available
    get.checkAvailabilityDVD(film_id,(err,result)=>{
        
        if(err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"internal server error"})
            
        console.log(err)
        return 1;
            
        } 
        if(result.length == 0){
            app.autoSend(res,408,{"error_msg":"out of stock"})
            return 1;
        } 
        var inventory_id = result[0].inventory_id
        // check price
        get.getRentalAmount(film_id,(err1,result1)=>{
            
            if(err1){
                console.log(err1)
                app.autoSend(res,500,{"error_msg":"internal server error"})
                
                return 1;
            } 
            if(result1.length == 0){
                app.autoSend(res,408,{"error_msg":"unknown error"})
                return 1;
            } 
            var rental_rate = result1[0].rental_rate
            var rental_duration = result1[0].rental_duration
            if(daysOfRental < rental_duration){
                var price = rental_rate
            } else {
                var price = rental_rate + (daysOfRental * rental_rate)
            }
            // add to rental record 
            post.addRentalRecord(rental_date,inventory_id,cust_id,return_date,(err2,result2)=>{
                
                if(err2){
                    app.autoSend(res,500,{"error_msg":"internal server error"})
                    console.log(err2)
                    return 1;
                } 
                if(result2.affectedRows == 0){
                    app.autoSend(res,408,{"error_msg":"unknown error"})
                    return 1;
                } 
                var rental_id = result2.insertId
                post.addPaymentRecord(cust_id,rental_id,price,today_date,(err3,result3)=>{
                    if(err3){
                        console.log(err3)
                        remove.removeRentalRecord(rental_id,(err4,result4)=>{
                            if(err4){
                                app.autoSend(res,500,{"error_msg":"too many errors, contact admin"})
                                return 1
                            } else {
                                app.autoSend(res,500,{"error_msg":"internal server error"})
                                return 1
                            }
                        })
                    } else {
                        if(result3.affectedRows==0){
                            app.autoSend(res,500,{"error_msg":"interal server error"})
                            return 1
                        }
                        remove.removeCartItem(film_id,cust_id,(err5,result5)=>{
                            if(err5){
                                app.autoSend(res,500,{"error_msg":"interal server error"})
                                return 1
                            }
                            app.autoSend(res,201,{"success_msg":"payment updated"})
                        })
                        
                    }
                })
            })
        })        
    })
    
    
})
app.post("/addToCart",verify,(req,res)=>{
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }
    var film_id = req.body.film_id
    get.checkInCart(film_id,req.userId,(err,result)=>{
        if(err){
            app.autoSend(res,500,{"error_msg":"Internal server error"})
        } else {
            if(result.length==0){
                get.checkAvailabilityDVD(film_id,(err3,result3)=>{
                    if(err3){
                        app.autoSend(res,500,{"error_msg":"internal server error"})
                        
                    console.log(err3)
                    return 1;
                        
                    } 
                    if(result3.length == 0){
                        app.autoSend(res,411,{"error_msg":"out of stock"})
                        return 1;
                    } 
                    post.addToCart(req.userId,film_id,(err2,result2)=>{
                        if(err2){
                            app.autoSend(res,500,{"error_msg":"Internal server error"})
                        } else {
                            app.autoSend(res,200,{"success_msg":"Internal server error"})
                        }
                    })
                })
                
            } else {
                app.autoSend(res,408,{"error_msg":"item added"})
            }
        }
    })
})
app.post("/addRequest",verify,(req,res)=>{
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }
    var film_year = req.body.film_year
    var title = req.body.title
    
    post.requestForNew(req.userId,film_year,title,(err2,result2)=>{
        if(err2){
            console.log(err2)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
        } else {
            app.autoSend(res,200,{"success_msg":"Internal server error"})
        }
    })
            
})

// GET Requests

app.get("/dvdSearch",(req,res)=>{
    
    var getObj = {}
    if(req.query.title){
        getObj.title = req.query.title 
    }
    if(req.query.max){
        getObj.max = req.query.max 
    }
    if(req.query.category){
        getObj.category = req.query.category 
    }
    

    get.getDvdList(getObj,(err,result)=>{
        
            if (err){
                console.log(err)
                app.autoSend(res,500,{"error_msg":"Internal server error"})
                return 1
            } 
            app.autoSend(res,200,result)
        
    })
})
app.get("/dvdDetails/:id",(req,res)=>{
    var id = req.params.id;
    get.getDvdDetail(id,(err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        get.getFilmActors(id,(err2,results2)=>{
            if (err2){
                app.autoSend(res,500,{"error_msg":"Internal server error"})
                return 1
            } 
            get.getReviews(id,(err3,results3)=>{
                if (err3){
                    app.autoSend(res,500,{"error_msg":"Internal server error"})
                    return 1
                } 
                var final = {"film":results,"actors":results2,"review":results3}
                app.autoSend(res,200,final)
            })
            
        })
    })
})
app.get("/dvdRecommend",(req,res)=>{
    get.getPopularDvdList((err,results)=>{
        if (err){
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        app.autoSend(res,200,results)
    })
})
app.get("/getCity",(req,res)=>{
    get.getCityList((err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        app.autoSend(res,200,results)
    })
})
app.get("/checkAvailableFilm",verify,(req,res)=>{
    
    get.checkAvailabilityDVD(req.query.film_id,(err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        if(results.length>0){
            app.autoSend(res,200,{"ava":false})
        } else {
            app.autoSend(res,200,{"ava":true})
        }
    })
})
app.get("/checkAddedCart",verify,(req,res)=>{
    var film_id = req.query.film_id
    get.checkInCart(film_id,req.userId,(err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        if(results.length>0){
            
            app.autoSend(res,200,{"bought":true})
        } else {
            app.autoSend(res,200,{"bought":false})
        }
    })
})
app.get("/checkBought",verify,(req,res)=>{
    var film_id = req.query.film_id
    
    get.checkFilmBought(req.userId,film_id,(er,ress)=>{
        if(er){
            app.autoSend(res,500,{"error_msg":"Internal server error"})
        } else {
            if(ress.length>0){
                app.autoSend(res,200,{"bought":true})
                return 1;
            } 
            app.autoSend(res,400,{"bought":false})
        }
    })
        
})
app.get("/getCat",(req,res)=>{
    get.getCategories((err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        app.autoSend(res,200,results)
    })
})
app.get("/getReviews",verify,(req,res)=>{
    get.getCustReviews(req.userId,(err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        app.autoSend(res,200,results)
    })
})
app.get("/checkReview/:id",verify,(req,res)=>{
    get.checkReview(req.userId,req.params.id,(err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        if(results.length>0){
            app.autoSend(res,200,{"done":true})
        } else {
            app.autoSend(res,200,{"done":false})
        }
        
    })
})
app.get("/getLang",(req,res)=>{
    get.getLang((err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        app.autoSend(res,200,results)
    })
})
app.get("/getCartDetails",verify,(req,res)=>{
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }

    get.getUserCart(req.userId,(err,results)=>{
        if (err){
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        app.autoSend(res,200,results)
    })
})
app.get("/getPurchaseHistory",verify,(req,res)=>{
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }

    get.getUserHistory(req.userId,(err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        app.autoSend(res,200,results)
    })
})
app.get("/getProfileData",verify,(req,res)=>{
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }

    get.getUserProfile(req.userId,(err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        app.autoSend(res,200,results)
    })
})
app.get("/getAdminProfileData",verify,(req,res)=>{
    if(req.userType != "staff"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }
    get.getAdminProfile(req.userId,(err,results)=>{
        if (err){
            console.log(err)
            app.autoSend(res,500,{"error_msg":"Internal server error"})
            return 1
        } 
        app.autoSend(res,200,results)
    })
})

// PUT Requests

app.put("/updateAdmin",verify,(req,res)=>{
    if(req.userType != "staff"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }
    var possibleAddress = ["address","address2","district","postal_code","phone","city_id"]
    var possibleStaff = ["store_id","first_name","last_name","active"] // cannot change email password
    // in the front, you give get country and city list and show and filter shown
    var address = _.pick( req.body,possibleAddress); // find values in array that are presnt in object and create new obj
    var staff = _.pick( req.body,possibleStaff);
    
    if(_.isEmpty(address)&&_.isEmpty(staff)){
        app.autoSend(res,200,{"msg":"Nothing to update"})
    } else if(!(_.isEmpty(address)||_.isEmpty(staff))){
        get.getAddressIdAdmin(req.userId,(err1,result1)=>{
            if(err1){
                app.autoSend(res,500,{"error_msg":"internal server error"})
                return 1
            } 
            put.updateAddress(_.keys(address),_.values(address),result1[0].address_id,(err,result)=>{
                if(err){
                    app.autoSend(res,500,{"error_msg":"internal server error"})
                    return 1
                } 
                put.updateAdmin(_.keys(staff),_.values(staff),req.userId,(err2,result2)=>{
                    if(err2){
                        app.autoSend(res,500,{"error_msg":"internal server error"})
                        return 1
                    } 
                    app.autoSend(res,200,{"success_msg":"record updated"})
                })
            })
        })
    } else if(!(_.isEmpty(address))){
        get.getAddressIdAdmin(req.userId,(err1,result1)=>{
            if(err1){
                app.autoSend(res,500,{"error_msg":"internal server error"})
                return 1
            } 
            put.updateAddress(_.keys(address),_.values(address),result1[0].address_id,(err,result)=>{
                if(err){
                    app.autoSend(res,500,{"error_msg":"internal server error"})
                    return 1
                } 
                app.autoSend(res,200,{"success_msg":"record updated"})
            })
        })
    } else {
        put.updateAdmin(_.keys(staff),_.values(staff),req.userId,(err2,result2)=>{
            if(err2){
                app.autoSend(res,500,{"error_msg":"internal server error"})
                return 1
            } 
            app.autoSend(res,200,{"success_msg":"record updated"})
        })
    }
})
app.put("/updateUser",verify,(req,res)=>{
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    }
    var possibleAddress = ["address","address2","district","postal_code","phone","city_id"]
    var possibleCust = ["store_id","first_name","last_name","active"] // cannot change email password
    // in the front, you give get country and city list and show and filter shown
    var address = _.pick(req.body,possibleAddress); // find values in array that are presnt in object and create new obj
    var cust = _.pick(req.body,possibleCust);
    
    if(_.isEmpty(address)&&_.isEmpty(cust)){
        app.autoSend(res,200,{"msg":"Nothing to update"})
    } else if(!(_.isEmpty(address)||_.isEmpty(cust))){
        
        get.getAddressIdUser(req.userId,(err1,result1)=>{
            if(err1){
                console.log(err1)
                app.autoSend(res,500,{"error_msg":"internal server error"})
                return 1
            } 
            put.updateAddress(_.keys(address),_.values(address),result1[0].address_id,(err,result)=>{
                if(err){
                    console.log(err)
                    app.autoSend(res,500,{"error_msg":"internal server error"})
                    return 1
                } 
                put.updateUser(_.keys(cust),_.values(cust),req.userId,(err2,result2)=>{
                    if(err2){
                        console.log(err)
                        app.autoSend(res,500,{"error_msg":"internal server error"})
                        return 1
                    } 
                    app.autoSend(res,200,{"success_msg":"record updated"})
                })
            })
        })
    } else if(!(_.isEmpty(address))){
        get.getAddressIdUser(req.userId,(err1,result1)=>{
            if(err1){
                app.autoSend(res,500,{"error_msg":"internal server error"})
                return 1
            } 
            put.updateAddress(_.keys(address),_.values(address),result1[0].address_id,(err,result)=>{
                if(err){
                    app.autoSend(res,500,{"error_msg":"internal server error"})
                    return 1
                } 
                app.autoSend(res,200,{"success_msg":"record updated"})
            })
        })
    } else {
        put.updateUser(_.keys(cust),_.values(cust),req.userId,(err2,result2)=>{
            if(err2){
                app.autoSend(res,500,{"error_msg":"internal server error"})
                return 1
            } 
            app.autoSend(res,200,{"success_msg":"record updated"})
        })
    }
})
// DELETE requests

app.delete("/delReview/:film",verify,(req,res)=>{
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    } 
    var film_id = req.params.film
    remove.removeReview(req.userId,film_id,(err,result)=>{
        if(err){
            app.autoSend(res,500,{"error_msg":"internal server error"})
        } else {
            app.autoSend(res,200,{"success_msg":"record deleted"})
        }
    })
})
app.delete("/delCart/:id",verify,(req,res)=>{
    if(req.userType != "customer"){
        app.autoSend(res,401,{"err_msg":"Auth error"})
        return 1
    } 
    var film_id = req.params.id
    remove.removeCartItem(film_id,req.userId,(err,result)=>{
        if(err){
            app.autoSend(res,500,{"error_msg":"internal server error"})
        } else {
            app.autoSend(res,200,{"success_msg":"record deleted"})
        }
    })
})

module.exports = app