/* front end js for Scraper18
 * -/-/-/-/-/-/-/-/-/-/-/- */

// 1: Global defines
// =================

// articles array
var articles = [];

// current article counter
var cur_article = 0;

// article class constructor
function Article(title, nutgraf, image, link, id, arr){
	// save the arguments as the object's properties
	this.title = title;
	this.nutgraf = nutgraf;
	this.image = image;
	this.link = link;
	this.id = id

	// on construction, push object to array specified in last arg
	// (e.g., the "articles" array)
	arr.push(this);
}



// 2: Functions
// ============

// to run on load
var load = function(){
	// first, we scrape
	$.get('api/scrape', function(){
		// if the scrape is successful, make the next api call
		// to grab articles from the db
		$.get("api/retrieve", function(data){
			// on success, we grab the data and place it in the articles array
			// using the article class constructor above
			$.each(data, function(i){
				new Article(data[i].title, 
										data[i].nutgraf, 
										data[i].image, 
										data[i].link, 
										data[i]._id,
										articles
									);
			})
			dispArticle();
		})
	})
}

// display the current article and apropos comments
var dispArticle = function(){
	// first, get the current article
	var article = articles[cur_article];
	// display that article on the page
	// first create div
	var theDiv = $('<div>').addClass('article');
	// then the contents of the div
	var storyNum = $('<p>').addClass('storyNum')
								 .text("Story #" + (cur_article + 1));
	var storyTitle = $('<h2>').addClass('storyTitle')
								 	 .text(article.title);
	var storyNutgraf = $('<p>').addClass('storyNutgraf')
									   .text(article.nutgraf);
	// father the div
	theDiv.append(storyNum, storyTitle, storyNutgraf);
	// and place that div in the proper spot on our page
	$('#storyDisplay').append(theDiv);

	// and make the button section show the right nums
	$('#articleCounter').text("Article " + (cur_article + 1) + 
														" of " + articles.length);
}
//

// calls
$(document).on("ready", function(){
	load();
})