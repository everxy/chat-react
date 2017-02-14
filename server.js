require('babel-register')
var swig = require('swig'),
	React = require('react'),
	ReactDOM = require('react-dom/server'),
	Router = require('react-router'),
	routes = require('./app/routes');

var express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	bodyParser = require('body-parser'); //parsering POST request data

var app = express();

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(function(req, res) {
	Router.match({
		routes: routes.default,
		location: req.url
	}, function(err, redirectLocation, renderProps) {
		if (err) {
			res.status(500).send(err.message)
		} else if (redirectLocation) {
			res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
		} else if(renderProps) {
			var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
			var page = swig.renderFile('views/index.html', {
				html: html
			})
			res.status(200).send(page)
		} else {
			res.status(404).send('Page Not Found ')
		}

	})
})

// app.listen(app.get('port'), function() {
// 	console.log('Express server listening on port:' + app.get('port'))
// })

/*
* Socket.io stuff
*/

var server = require('http').createServer(app),
	io = require('socket.io')(server),
	onlineUsers = 0;

io.sockets.on('connection',function(socket){
	onlineUsers++;

	io.sockets.emit('onlineUsers',{ onlineUsers: onlineUsers })

	socket.on('disconnect',function(){
		onlineUsers--;
		io.sockets.emit('onlineUsers',{ onlineUsers:onlineUsers })

	})
})

server.listen(app.get('port'),function(){
	console.log('Express server listening on port:' + app.get('port'))
})