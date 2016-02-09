import React from 'react';
import {render} from 'react-dom';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

function invertHex(hexnum){
  if(hexnum.length != 6) {
    alert("Hex color must be six hex numbers in length.");
    return false;
  }
	
  hexnum = hexnum.toUpperCase();
  var splitnum = hexnum.split("");
  var resultnum = "";
  var simplenum = "FEDCBA9876".split("");
  var complexnum = new Array();
  complexnum.A = "5";
  complexnum.B = "4";
  complexnum.C = "3";
  complexnum.D = "2";
  complexnum.E = "1";
  complexnum.F = "0";
	
  for(var i=0; i<6; i++){
    if(!isNaN(splitnum[i])) {
      resultnum += simplenum[splitnum[i]]; 
    } else if(complexnum[splitnum[i]]){
      resultnum += complexnum[splitnum[i]]; 
    } else {
      alert("Hex colors must only include hex numbers 0-9, and A-F");
      return false;
    }
  }
	
  return resultnum;
}

function getTweets(callback) {
	fetch('/api/twitter/get')
	.then(function(response) {
		return response.json()
	  }).then(function(json) {
	    callback(json);
	  })
}

function renderTweet(tweet) {
	let style = {
		backgroundColor: `#${tweet.user.profile_background_color}`,
		color: `#${invertHex(tweet.user.profile_background_color)}`
	}

	let profileImage = tweet.user['profile_image_url_https'];

	return (
		<div id={tweet.id} key={tweet.id} className="tweet" style={style}>
			{tweet.text}
			<div className="user">
				<a href={`https:\/\/twitter.com\/${tweet.user['screen_name']}`} target="_blank">
					@{tweet.user['screen_name']}
				</a>
			</div>
			{profileImage ? <img className="user-image" src={profileImage} /> : null}
		</div>
	);
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tweets: []
		};
		this.updateTweets = this.updateTweets.bind(this);
	}

	updateTweets(tweetData) {
		console.log(tweetData);
		this.setState({
			tweets: _.take(tweetData.statuses.concat(this.state.tweets), 150)
		});
	}

	componentDidMount() {
		getTweets(this.updateTweets);
		setInterval(() => getTweets(this.updateTweets), 30000);
	}

	render () {
		return (
			<div>
				{this.state.tweets.map(renderTweet)}
			</div>
		);
	}
}

render(<App/>, document.getElementById('app'));