// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
var db = require("../db")
// later check if the db vairbales are correct
var f =  {
    getDvdList : function(getObj,callback){
        if(Object.keys(getObj).length == 0){
            var sql = `SELECT film_id FROM film limit 50` // later start using limit
        } else {
            var sql = `SELECT film.film_id FROM film 
            INNER JOIN film_category ON film.film_id = film_category.film_id 
            WHERE`
            num = 0
            if(getObj.title){
                sql += ` film.title LIKE '${getObj.title}%'`
                num ++;
            }
            if(getObj.max){
                if(num==0){
                    sql += ` film.rental_rate < ${getObj.max}`
                    num++;
                } else {
                    sql += ` AND film.rental_rate < ${getObj.max}`
                }
            }
            if(getObj.category){
                if(num==0){
                    sql += ` film_category.category_id = '${getObj.category}'`
                } else {
                    sql += ` AND film_category.category_id = '${getObj.category}'`
                }
            }
        }        
        db.autoQuery(sql,callback)
    },

    getDvdDetail : function(id,callback){
        var sql = `SELECT film.film_id,
        category.name as category, 
        film.rental_rate, 
        film.title, 
        film.release_year, 
        film.description, 
        film.rating, 
        film.length, 
        film.rental_duration 
      FROM film 
        JOIN film_category ON film.film_id = film_category.film_id 
        JOIN category ON film_category.category_id = category.category_id 
        JOIN film_text ON film.film_id = film_text.film_id 
        JOIN language ON film.language_id = language.language_id
      WHERE film.film_id = ${id};`
        db.autoQuery(sql,callback)
    },
    getFilmActors : function(id,callback){
        var sql = `SELECT
        actor.first_name,
        actor.last_name
        FROM film
        JOIN film_actor ON film.film_id = film_actor.film_id
        JOIN actor ON film_actor.actor_id = actor.actor_id
        WHERE film.film_id = ${id};`

        db.autoQuery(sql,callback)
    },

    getUserHistory : function(id,callback){
        var sql = `SELECT inventory.film_id
        FROM rental
        JOIN inventory ON rental.inventory_id = inventory.inventory_id
        WHERE rental.customer_id = ${id}
        ORDER BY rental.rental_date DESC;`
        db.autoQuery(sql,callback)
    },
    checkFilmBought : function(id,film_id,callback){
        var sql = `SELECT inventory.film_id
        FROM rental
        JOIN inventory ON rental.inventory_id = inventory.inventory_id
        WHERE rental.customer_id = ${id}
        and film_id = ${film_id}
        ORDER BY rental.rental_date DESC;`
        db.autoQuery(sql,callback)
    },

    getUserProfile : function(id,callback){
        var sql = `SELECT 
        customer.first_name, customer.last_name, customer.email, address.city_id,
        address.address, address.address2, address.district, address.postal_code, address.phone 
        FROM customer
        JOIN address ON customer.address_id = address.address_id
        WHERE customer.customer_id = ${id};`
        db.autoQuery(sql,callback)
    },

    getAdminProfile : function(id,callback){
        var sql = `SELECT 
        staff.first_name, staff.last_name, staff.email, staff.username, staff.password,
        address.address, address.address2, address.district, address.postal_code,address.city_id, address.phone
        FROM staff
        JOIN address ON staff.address_id = address.address_id
        WHERE staff.staff_id = ${id};`
        db.autoQuery(sql,callback)
    },

    getUserCart : function(id,callback){
        var sql = `select film_id from cart where customer_id = ${id}`
        db.autoQuery(sql,callback)
    },
    checkReview : function(id,film_id,callback){
        var sql = `select * from review where customer_id = ${id} and film_id=${film_id}`
        db.autoQuery(sql,callback)
    },
    getCustReviews : function(id,callback){
        var sql = `select * from review where customer_id = ${id}`
        db.autoQuery(sql,callback)
    },
    getPopularDvdList : function(callback){
        var sql = `SELECT inventory.film_id FROM inventory
        JOIN rental ON inventory.inventory_id = rental.inventory_id
        GROUP BY inventory.film_id
        ORDER BY COUNT(inventory.film_id) DESC
        LIMIT 12;`
        db.autoQuery(sql,callback)
    },
    getAddressIdAdmin :function(id,callback){
        var sql = `select address_id from staff where staff_id = ${id}`
        db.autoQuery(sql,callback)
    }
    ,
    getAddressIdUser :function(id,callback){
        var sql = `select address_id from customer where customer_id = ${id}`
        db.autoQuery(sql,callback)
    }
    ,
    getCityList :function(callback){
        var sql = `select * from city`
        db.autoQuery(sql,callback)
    }
    ,
    getCategories :function(callback){
        var sql = `select * from category`
        db.autoQuery(sql,callback)
    }
    ,
    checkAvailabilityDVD : function(film_id,callback){
        var sql = `select inventory.inventory_id from inventory join rental on rental.inventory_id = inventory.inventory_id where inventory.film_id=${film_id} and rental.return_date < NOW() `
        db.autoQuery(sql,callback)
    },
    checkEmailExists : function(email,callback){
        var sql = `select * from customer where email="${email}"`
        db.autoQuery(sql,callback)
    },
    checkInCart : function(film_id,customer_id,callback){
        var sql = `select * from cart where customer_id=${customer_id} and film_id=${film_id}`
        db.autoQuery(sql,callback)
    },
    getRentalAmount: function(film_id,callback){
        var sql = `select rental_rate,rental_duration from film where film_id = ${film_id}`
        db.autoQuery(sql,callback)
    } ,
    getReviews: function(film_id,callback){
        var sql = `select rating,review from review where film_id = ${film_id}`
        db.autoQuery(sql,callback)
    } 
}

module.exports = f;