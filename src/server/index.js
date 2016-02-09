var Twit = require('twit');
var webpack = require('webpack');
var webpackMiddleware = require("webpack-dev-middleware");
var express = require('express');
var webpackConfig = require('./../../webpack.config');
var appConfig = require('./config');

var app = express();

var twitter = new Twit({
  consumer_key: appConfig.consumerKey,
  consumer_secret: appConfig.consumerSecret,
  access_token: appConfig.accessToken,
  access_token_secret: appConfig.accessTokenSecret,
  timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests. 
})

app.use(webpackMiddleware(webpack(webpackConfig), {
    // all options optional

    noInfo: false,
    // display no info to console (only warnings and errors)

    quiet: false,
    // display nothing to the console

    lazy: false,
    // switch into lazy mode
    // that means no watching, but recompilation on every request

    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },
    // watch options (only lazy: false)

    publicPath: "/",
    // public path to bind the middleware to
    // use the same as in webpack

    stats: {
        colors: true
    }
}));

app.use(express.static('public'));

app.get('/api/twitter/get',function (req, res) {
	twitter.get('search/tweets', { q: '#SB50 -filter:retweets', count: 20 }, function(err, data, response) {
	  res.send(data);
	})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});