// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
var db = require("../db")
var f = {
    removeReview : function(customer_id,film_id,callback){
        var sql = `DELETE FROM review 
        WHERE customer_id = ${customer_id} and film_id = ${film_id};`
        db.autoQuery(sql,callback)
    },
    removeCartItem : function(film_id, customer_id,callback){
        var sql = `DELETE FROM cart 
        WHERE film_id = ${film_id} and customer_id = ${customer_id};`
        db.autoQuery(sql,callback)
    },
    removeRentalRecord : function(rental_id,callback){
        var sql = `DELETE FROM rental 
        WHERE rental_id = ${rental_id};`
        db.autoQuery(sql,callback)
    },
    removeAddress : function(address_id,callback){
        var sql = `DELETE FROM address 
        WHERE address_id = ${address_id};`
        db.autoQuery(sql,callback)
    }
}
module.exports = f;