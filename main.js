var express = require('express');
var app = express();

// var handlebars = require('express-handlebars').create({defaultLayout:'main'});
// app.set('view engine', '.handlebars');
// app.engine('.handlebars', handlebars({
//     layoutsDir: __dirname + '/views/layouts',
//     defaultLayout: 'main',
// }));

const handlebars = require('express-handlebars');
app.set('view engine', '.handlebars');
app.engine('.handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: '.handlebars'
}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', 3000);

app.get('/', function(req, res, next){
    res.render('index');
});


app.use((req, res) => {
    res.status(404);
    res.render('404');
});
   
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), () => {
    console.log(`\nExpress started at http://localhost:${app.get('port')}\nPress ctrl-C to terminate.\n`);
});