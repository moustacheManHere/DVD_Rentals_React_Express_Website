// Name: Jeyakumar Sriram
// Admin Number: 2214618
// Class: DAAA/FT/1B/01
var app= require('./controller/app');
var port = 3001;
var host = "localhost";

app.listen(port,host,function(){
    console.log(`Server hosted at http://${host}:${port}/`)
})