var mongoose= require('mongoose');
var Schema=mongoose.Schema;
var user = new Schema({
  username: String,
  password: String,
  firstname: String,
  lastname:String,
  penname:String,
  root:Boolean,
  active:Boolean,
  email:String

},{collection: 'users'});
mongoose.model('users',user);

var reader= new Schema({
	name: String,
	email:String
},{collection:'readers'});
mongoose.model('readers',reader);

var category=new Schema({
	name:String,
	description:String
},{collection:'category'});
mongoose.model('category',category);

var image=new Schema({
	name:String,
	path:String,
	encoding:String,
	mimetype:String,
},{collection:'image'});
mongoose.model('image',image);

var paragraph=new Schema({
	content:String
},{collection:'paragraph'});
mongoose.model('paragraph',paragraph);

var comment =new Schema({
	// reader:Schema.ObjectId,
	content:String,
	article:Schema.ObjectId,
	like:Number,
	date_added:Date
},{collection:'comment'});
mongoose.model('comment',comment);

var reply =new Schema({
	reader: Schema.ObjectId,
	content:String,
	commentid:Schema.ObjectId,
	date_added:Date
},{collection:'reply'});
mongoose.model('reply',reply);

// var ArticleContent = new Schema({
// 	// like:[Schema.ObjectId],
// 	content:String,
// 	// paragraphandimage:[Schema.ObjectId],
// 	// comments:[Schema.ObjectId]
// },{collection:'ArticleContent'});
// mongoose.model('ArticleContent',ArticleContent);

var article= new Schema({
	title:String,
	description:String,
	likeNumber:Number,
	author:Schema.ObjectId,
	content:String,
	penname:String,
	category:String,
	thumbleImage:Schema.ObjectId,
	published:Boolean,
	content:String,
	date_added:Date,
	view:Number,
	thumbleImageName:String
},{collection:'article'});

mongoose.model('article',article);