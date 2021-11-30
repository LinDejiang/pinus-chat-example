const express =  require('express')
var app = express();


app.use(express.static('public'))

console.log("Web server has started.\nPlease log on http://127.0.0.1:3001/index.html");
app.listen(3001);
