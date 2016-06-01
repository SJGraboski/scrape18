/* front end js for Scraper18
 * -/-/-/-/-/-/-/-/-/-/-/- */

// 1: Global defines
// =================

// articles array
var articles = [];

// article class constructor
function Article(title, nutgraf, image, link, date, note, arr){
	// save the arguments as the object's properties
	this.title = title;
	this.nutgraf = nutgraf;
	this.image = image;
	this.link = link;
	this.date = date;
	this.note = note;

	// on construction, push object to array specified in last arg
	// (e.g., the "articles" array)
	arr.push(this);
}



// 2: Functions
// ============
var load = function(){
	// first, we scrape
	$.get('api/scrape', function(){
		console.log("scrape OKAY")
		// if the scrape is successful, make the next api call
		// to grab articles from the db
		// $.get("api/articles", function(data){
		// 	// on success, we grab the data and place it in the articles array
		// 	// using the article class constructor above
		// 	$.each(data, function(i){
		// 		new Article(data[i].title, 
		// 								data[i].nutgraf, 
		// 								data[i].image, 
		// 								data[i].link, 
		// 								data[i].date,
		// 								data[i].note
		// 							);
		// 	})
		// 	console.log(articles);
		// })
	})
}

// calls
$(document).on("ready", function(){
	load();
})