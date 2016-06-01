/* Scrape 18: The latest tech news from Reuters tech section
 *
 * =============================================================================== */

// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');


// start the express app
var app = express();

// use logger in dev mode
app.use(logger('dev'));

// set up bodyparse
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));


// make static folder
var staticContentFolder = __dirname + '/public';
app.use(express.static(staticContentFolder));

// our app routes go here
// require('./routes/html.js')(app);
// require('./routes/api.js')(app);


// configure our db with mongoose
mongoose.connect('mongodb://localhost/scrape18');
var db = mongoose.connection;

// mongoose connection: if err, tell us what's up
db.on('error', function(err){
	console.log('Mongoose Error: ', err);
});
// once the con's open, tell us
db.once('open', function(){
	console.log('Mongoose connection successful!');
})

// require our Mongoose models
var Articles = require(__dirname + '/models/Articles.js');
var Comments = require(__dirname + '/models/Comments.js');



request('http://www.reuters.com/news/archive/technologyNews', function (error, response, html) {

  var $ = cheerio.load(html);
  if ($('.news-headline-list')) {
	  $('.story').each(function() {
	  	var article = {
				title: 		$(this).find('h3').text(),
				nutgraf: 	$(this).find('p').text(),
				image: 		$(this).find('.story-photo a img').attr('org-src'),
				link: 		$(this).find('.story-photo a').attr('href'),
				date: 		$(this).find('span.timestamp').text()
	  	}
	  	var addArticle = new Articles(article);
	  	addArticle.save(function(err, doc){
	  		if (err){
	  			console.log(err);
	  		} else {
	  			console.log(doc);
	  		}
	  	})
	  });
 	};
})


// define port
var PORT = 3000 || process.env.PORT;

// listen
app.listen(PORT, function(){
	console.log('app listening on port 3000')
})

