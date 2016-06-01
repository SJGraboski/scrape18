// set up our mongoose schema class
var mongoose = require('mongoose');
var Schema = mongoose.Schema

// make our Article schema
var ArticlesSchema = new Schema({
	title: {
		type: String,
		unique: true,
		required:true
	},
	nutgraf: {
		type: String,
		required:true
	},
	image: {
		type: String,
		required:true
	},
	link: {
		type: String,
		required:true
	},
	date: {
		type: String,
		required:true
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: 'Comments'
	}
});

var Articles = mongoose.model('Articles', ArticlesSchema);
module.exports = Articles;
