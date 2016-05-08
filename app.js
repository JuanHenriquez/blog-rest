var express          = require('express'),
	bodyParser       = require('body-parser'),
	mongoose         = require('mongoose'),
	methodOverride   = require('method-override'),
	expressSanitizer = require('express-sanitizer'),
	Blog             = require('./models/blog.js'),
	app              = express();

// App Config.
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Take the route query string with _method paramter and coverto 
// to a specific method.
app.use(methodOverride('_method'));

// Use allways after body-parser.
app.use(expressSanitizer());

app.set('view engine', 'ejs');


// ===============
// DB Setup ======
// ===============
mongoose.connect('mongodb://localhost/blog-rest');



	// Blog.create({
	// 	title: 'Messi is the BEST!',
	// 	image: 'http://placehold.it/350x200',
	// 	body: 'Messi won again the Golden Ball and now he have 5 balls in his house'
	// });

// ===============
// ROUTES ========
// ===============

app.get('/', function(req, res){
	res.redirect('/blogs');
});

// Index Route.
app.get('/blogs', function(req, res){
	Blog.find({}, function(err, blogs){
		if (err) {
			console.log('ERROR: ' + err);
		} else {
			res.render('index', { blogs: blogs });
		}
	});
});

// New Route.
app.get('/blogs/new', function(req, res){
	res.render('new');
});

// Create Route.
app.post('/blogs', function(req, res){

	// Sanitize the post description.
	req.body.blog.body = req.sanitize(req.body.blog.body);

	Blog.create(req.body.blog, function(err, blog){
		if (err) {
			res.render('new');
		} else {
			res.redirect('/blogs');
		}
	});
});

// Show Route.
app.get('/blogs/:id', function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render('show', { blog: blog });
		}
	});
});

// Edit Route.
app.get('/blogs/:id/edit', function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render('edit', { blog: blog });
		}
	});
});

// Update Route.
app.put('/blogs/:id', function(req, res){

	// Sanitize the post description.
	req.body.blog.body = req.sanitize(req.body.blog.body);

	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
		if (err) {
			console.log('Error: ' + err);
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	})
});

// Delete Route.
app.delete('/blogs/:id', function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			console.log('Error: ' + err);
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	});
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('Blog REST Server has started.');
});


