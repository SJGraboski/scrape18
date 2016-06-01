/* front end js for Scraper18
 * -/-/-/-/-/-/-/-/-/-/-/- */

// 1: Global defines
// =================

// articles array
var articles = [];

// current article counter
var cur_article = 1;

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
	// Part 1: display the article
	// first, get the current article (-1 to accomodate for array index)
	var article = articles[cur_article - 1];
	// display that article on the page
	// first create div
	var theDiv = $('<div>').addClass('article')
								.attr('data-id', article.id);
	// then the contents of the div
	var storyNum = $('<p>').addClass('storyNum')
								 .text("Story #" + (cur_article));
	var storyTitle = $('<h2>').addClass('storyTitle')
								 	 .text(article.title);
	var storyNutgraf = $('<p>').addClass('storyNutgraf')
									   .text(article.nutgraf);
	// father the div
	theDiv.append(storyNum, storyTitle, storyNutgraf);
	// and place that div in the proper spot on our page
	$('#storyDisplay').html(theDiv);

	// and make the button section show the right nums
	$('#articleCounter').text("Article " + (cur_article) + 
														" of " + articles.length);


	// Part3: Display the Comment Form
	// first, save the default form
		var comForm = '<form id="leaveComment" action="api/comment/' + article.id +'" method="POST" role="form">' +
										'<legend>Leave a Comment</legend>' +
											'<div class="form-group">' +
												'<input type="text" class="form-control" id="title" name="title" placeholder="Title">' +
												'<textarea type="text" class="form-control" id="body" name="body" rows="5" placeholder="Comment Text"></textarea>' +
											'</div>' +
											'<button type="submit" class="btn btn-primary">Submit</button>' +
									'</form>';

		// place the form on the page
		$('#commentForm').html(comForm);
}

// switch article (if isPrev is true, goes back an article. Otherwise, goes forward)
var articleSwitch = function(isPrev) {
	// get articles length
	var maxArticles = articles.length;
	// if it's not is prev, do make it go to the next article
	if (!isPrev) {
		cur_article++;
		// if that made cur_article's number exceed the max, make cur_article 1
		if (cur_article > maxArticles) {
			cur_article = 1;
		}
	} // but if isPrev is true
	else{
		// send the cur_article back one
		cur_article--;
		// but if that made cur_article equal 0, make cur_article = maxArticles
		if (cur_article == 0){
			cur_article = maxArticles
		}
	} 
	// with all that done, display the article
	dispArticle();
}


// calls
// =====

// on load
$(document).on("ready", function(){
	load();
})

// on press next and prev buttons
$(document).on('click', '#prev', function(){
	// isPrev = true
	articleSwitch(true);
})

$(document).on('click', '#next', function(){
	// isPrev = false
	articleSwitch(false);
})