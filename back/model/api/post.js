// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
var db = require("../db")
// standardise autoquery input
// need some mechanism to handle missing info in secondary tables. like if actor table adding but address id missing, need add.
// add new store id for online store and new staff_id
var f = {
    addReview : function(customer_id,film_id,rating,review,callback){
        // need (cust_id, film_id, stars, review text)
        var sql = `insert into review(customer_id,film_id,rating,review) values("${customer_id}","${film_id}","${rating}","${review}")`
        db.autoQuery(sql,callback)
    },
    addRentalRecord:function(rental_date,inventory_id,customer_id,return_date,callback){
        // validate dates before sending in, refer to chatgpt
        // use staff_id to be 3 for those added by admin oso
        var sql = `insert into rental(rental_date,inventory_id,customer_id,return_date,staff_id)
        values("${rental_date}","${inventory_id}","${customer_id}","${return_date}",3)`
        db.autoQuery(sql,callback)
    },
    addPaymentRecord : function(customer_id,rental_id,amount,payment_date,callback){
        // need (cust_id, staff_id = 3, amount,rental_id)
        // for rental need (inventory_id)
        // for inventory id need (film_id,store_id) 
        // too complex need to chill
        // payment date need to create using local time and validate
        // need function to check availability and give inventory_id. based on that create rental record and get rental_id based on that create payment_id
        // need function to get payment amount
        var sql = `insert into payment(customer_id,rental_id,amount,payment_date,staff_id)
        values("${customer_id}","${rental_id}","${amount}","${payment_date}",3)`
        db.autoQuery(sql,callback)
    },
    addCustomer : function(first_name,last_name,email,address_id,password,callback){
        // just get from ca1
        var sql = `insert into customer(first_name,last_name,email,address_id,store_id,active,password) 
        values ("${first_name}","${last_name}","${email}","${address_id}",1,1,"${password}")`
        db.autoQuery(sql,callback)
    }, // figure out which info to tolerate missing data
    addAddress : function(params,values,callback){
        // must validate if sufficient address provided
              
        var sql = `insert into address(${params.join(', ')}) values("${values.join('", "')}")`
        db.autoQuery(sql,callback)
    },
    addReview : function(customer_id,film_id,rating,review,callback){
        // need (cust_id, film_id, rating, stars)
        var sql = `insert into review(customer_id,film_id,rating,review) values("${customer_id}","${film_id}","${rating}","${review}")`
        db.autoQuery(sql,callback)
    },
    addToCart : function(customer_id,film_id,callback){
        // need (film_id, cust_id)
        // check whether record exists. maybe infer from error
        var sql = `insert into cart(film_id,customer_id) values("${film_id}","${customer_id}")`
        db.autoQuery(sql,callback)
    },
    requestForNew : function(customer_id,film_year,title,callback){
        // gt cust_id, film title, film year, film lang
        // add new lang if missing
        var sql = `insert into requests(customer_id,film_year,title) values("${customer_id}","${film_year}","${title}")`
        db.autoQuery(sql,callback)
    },


    // fallback requests
    addActor: function(first_name,last_name,callback){
        // 
        var sql = `insert into actor (first_name,last_name) values ("${first_name}","${last_name}")`
        db.autoQuery(sql,callback)
    }
}

module.exports = f;