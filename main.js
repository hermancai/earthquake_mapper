var express = require('express');
var app = express();

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
app.use(express.static(__dirname + '/public'));
app.set('port', 3000);


// Homepage
app.get('/', function(req, res, next){
    res.render('index');
});

// 404 Error
app.use((req, res) => {
    res.status(404);
    res.render('404');
});
   
// 500 Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), () => {
    console.log(`Express started at http://localhost:${app.get('port')} - Press ctrl-C to terminate.\n`);
});