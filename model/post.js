var mongodb = require('./db');

function Post(username, title, post, time) {
	this.user = username;
	this.title= title;
	this.post = post;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
}

module.exports = Post;

Post.prototype.save = function save(callback) {
	var post = {
		user: this.user,
		title:this.title,
		post: this.post,
		time: this.time,
	};

	mongodb.open(function (err, db) {
			if (err) {
				return callback(err);
			}

			db.collection('posts', function (err, collection) {
					if (err) {
						mongodb.close();
						return callback(err);
					}

					collection.ensureIndex('user');
					collection.insert(post, {
							safe: true
						}, function (err,post) {
							mongodb.close();
							callback(err,post);
						});
				});
		});
};

Post.get = function get(username, callback) {
	mongodb.open(function (err, db) {
			if (err) {
				return callback(err);
			}

			db.collection('posts', function(err, collection) {
					if (err) {
						mongodb.close();
						return callback(err);
					}

					var query = {};
					if (username) {
						query.user = username;
					}
					collection.find(query).sort({
							time: -1
						}).toArray(function (err, docs) {
								mongodb.close();
								if (err) {
									callback(err, null);
								}

								var posts = [];

								docs.forEach(function (doc, index) {
										var post = new Post(doc.user, doc.title, doc.post, doc.time);
										var now = post.time;
										post.time = now.getFullYear() + "-" + (now.getUTCMonth()+1) + "-" + now.getUTCDate();
										posts.push(post);
									});
								callback(null, posts);
							});
					});
			});
	};
	Post.findOne = function (id,callback){
		mongodb.open(function(err,db){
				db.collection("posts",function(err,collection){
						var query={};
						if(id){
							query.title=id;
						}
						collection.findOne({"title":id},function(err,doc){
								callback(null,doc)
								mongodb.close()
							})
						/*callback(null,collection.find(query))*/
						/*mongodb.close()*/
					})
			})
	}

	/*Post.remove = function(id,callback){*/
	/*mongodb.open(function(err,db){*/
	/*db.collection("posts",function(){*/
	/*var query={}*/
	/*if(id){query.title=id}*/
	/*collection.*/
	/*})*/
	/*})*/
	/*}*/
	Post.update=function(id,callback){
		mongodb.open(function(err,db){
				db.collection("posts",function(err,collection){
						collection.update({title:id},{$set:callback})
						mongodb.close()
					})
			})
	
	}
	Post.remove=function(id,callback){
		mongodb.open(function(err,db){
				db.collection("posts",function(err,collection){
						collection.remove({title:id},function(){mongodb.close()})
					})
			})
	
	}
	Post.add_comment=function(id,comment){
		mongodb.open(function(err,db){
				db.collection("posts",function(err,collection){
						collection.update({title:id},{$push:{comments:comment}})
						mongodb.close()
					})
			})
	}
