// api routes
// require dependencies
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');


// load our mongoose models
var Articles = require('../models/Articles.js');
var Comments = require('../models/Comments.js');


// export api routes for the express app
module.exports = function(app) {

	// api call that scrapes the page 
	// (returns code 200 ("OK") on err, since no scrape should not kill the site's process)
	app.get('/api/scrape', function(req, res) {
		// first, we scrape the Reuters tech section for articles.
		request('http://www.reuters.com/news/archive/technologyNews', function (error, response, html) {
		  var articles = [];
		  var $ = cheerio.load(html);
		  if ($('.news-headline-list')) {
			  $('.story').each(function() {
			  	// save the article
			  	var article = {
						title: 		$(this).find('h3').text(),
						nutgraf: 	$(this).find('p').text(),
						image: 		$(this).find('.story-photo a img').attr('org-src'),
						link: 		'http://www.reuters.com' + $(this).find('.story-photo a').attr('href'),
			  	}
	  			articles.push(article);
		  	})
		  };
	  	// with all that done, prepare to insert all non-duplicates into db
	  	// the ordered:false option lets all docs have a chance at insertion,
	  	// otherwise, one error (read: duplicate) would kill the whole process.
	  	Articles.create(articles, onInsert);

	  	// create the callback that the last method called
	  	function onInsert(err, docs){
	  		if (err){
	  			// for error, 200 (OK (nothing created, but not an end))
	  			console.log(err);
	  			res.status(200).end();
	  		} else {
	  			// else, 201 (Created)
	  			console.log(docs);
	  			res.status(201).end();
	  		}
	  	}
	 	});
	})
	
	// call to grap articles and send them as json
	app.get('/api/retrieve', function(req, res) {

		// reach into the Articles db for at least 50 results
		var query = Articles.find().sort({'createdAt': -1}).limit(50);
		query.exec(function(err, docs) {
			if (err){
				console.log(error)
			} else {
				res.json(docs);
			}
		})
	})
}