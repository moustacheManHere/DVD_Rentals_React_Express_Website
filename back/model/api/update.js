// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
var db = require("../db")
var f = {
    updateUser : function(paramsArray,valuesArray,id,callback){
        // check if array not empty before here
        var sql2 = ``
        if (paramsArray.length>1){
            for (i=1; i<paramsArray.length;i++){
                sql2 += `,${paramsArray[i]} = "${valuesArray[i]}"`
            }
        }
        var sql = `UPDATE customer
        SET ${paramsArray[0]} = "${valuesArray[0]}"`+sql2+`
        WHERE customer_id = "${id}";`
        db.autoQuery(sql,callback)
    },
    updateAddress : function(paramsArray,valuesArray,id,callback){
        var sql2 = ``
        if (paramsArray.length>1){
            for (i=1; i<paramsArray.length;i++){
                sql2 += `,${paramsArray[i]} = "${valuesArray[i]}"`
            }
        }
        var sql = `UPDATE address
        SET ${paramsArray[0]} = "${valuesArray[0]}"`+sql2+`
        WHERE address_id = "${id}";`
        db.autoQuery(sql,callback)
    },
    updateAdmin : function(paramsArray,valuesArray,id,callback){
        // check if array not empty before here
        var sql2 = ``
        if (paramsArray.length>1){
            for (i=1; i<paramsArray.length;i++){
                sql2 += `,${paramsArray[i]} = "${valuesArray[i]}"`
            }
        }
        var sql = `UPDATE staff
        SET ${paramsArray[0]} = "${valuesArray[0]}"`+sql2+`
        WHERE staff_id = ${id};`
        db.autoQuery(sql,callback)
    },
    updateReview : function(paramsArray,valuesArray,film_id,customer_id,callback){
        var sql2 = ``
        if (paramsArray.length>1){
            for (i=1; i<paramsArray.length;i++){
                sql2 += `,${paramsArray[i]} = "${valuesArray[i]}"`
            }
        }
        
        var sql = `UPDATE staff
        SET ${paramsArray[0]} = "${valuesArray[0]}"`+sql2+`
        WHERE film_id = ${film_id} and customer_id = ${customer_id};`
        db.autoQuery(sql,callback)
    }
}
module.exports = f;