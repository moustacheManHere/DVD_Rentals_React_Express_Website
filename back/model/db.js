// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
var mysql = require('mysql');
var dbconnect = {
    startConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "bed_dvd_root",
            password: "pa$$woRD123", 
            database: "bed_dvd_db"
        });
        return conn;
    },
    autoQuery:function(query,callback){ // replace all this boilerplate with one function

        var currentConnection = this.startConnection(); 
        // create connection to database
        currentConnection.connect(function(err){
            if (err){
                return callback(err,null);
            } 
            else { // query the database
                currentConnection.query(query, function (err2,results2){
                    currentConnection.end() // end database connection and return result

                    if(err2){
                        return callback(err2,null)
                    } else {
                        return callback(err2,results2);
                    }
                    
                })
            }
        })

    }
};
module.exports = dbconnect;