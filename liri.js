require("dotenv").config();

var keys = require("./keys.js");

var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//console.log(spotify);
//console.log(client);

function option(action, parameter) {

    switch (action) {
        case "my-tweets":
            console.log("my-tweets");
            getTwitter();
            break;
        case "spotify-this-song":
            console.log("spotify-this-song");
            getSpotify(parameter);
            break;
        case "movie-this":
            console.log("movie-this");
            omdb(parameter);
            break;
        case "do-what-it-says":
            readFile()
            console.log("do-what-it-says");
            break;
        default:
            console.log("Select an option and try again");
            console.log("my-tweets");
            console.log("spotify-this-song");
            console.log("movie-this");
            console.log("do-what-it-says");
    }
}

function init() {
    var action = process.argv[2];
    var parameter = process.argv[3];

    option(action, parameter);
}

init();


function getTwitter() {
    var params = { screen_name: 'marijar84', count: 20 };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) throw error;
        console.log(tweets.length);  // The favorites.

        var log = "";

        for (var i = 0; i < tweets.length; i++) {
            console.log('Created on: ', tweets[i].created_at);
            console.log('Tweet content: ', tweets[i].text);

            log += tweets[i].created_at + " ," + tweets[i].text + "\n";
        }
        appendFile(log);

    });
}

function getSpotify(nameSong) {
    var songQuery = nameSong

    if (nameSong == undefined) {
        songQuery = "The Sign";
    }
    else {
        songQuery = nameSong;
    }

    spotify.search({ type: 'track', query: songQuery }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var getArtists = data.tracks.items[0].album.artists;

        var artistsNames = "";

        for (var i = 0; i < getArtists.length; i++) {
            artistsNames = artistsNames + " , " + getArtists[i].name;
        }

        console.log("Artist(s): " + artistsNames);
        console.log("Song: " + data.tracks.items[0].name)
        console.log("Spotify URL: " + data.tracks.items[0].preview_url)
        console.log("Album Name: " + data.tracks.items[0].album.name);

        var log = artistsNames + ", " + data.tracks.items[0].name + ", " + data.tracks.items[0].preview_url + ", " + data.tracks.items[0].album.name + "\n";

        appendFile(log);
    });
}

function omdb(parameter) {

    if (parameter == undefined) {
        parameter = "Mr.+Nobody";
    } else {
        parameter = parameter.replace(" ", "+");
    }

    console.log(parameter);

    request("http://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            var resultJson = JSON.parse(body);

            console.log(resultJson.Title);
            console.log(resultJson.Year);
            console.log(resultJson.imdbRating);
            console.log(resultJson.Country);
            console.log(resultJson.Language);
            console.log(resultJson.Plot);
            console.log(resultJson.Actors);

            var log = resultJson.Title + ", " + resultJson.Year + ", " + resultJson.imdbRating + ", " + resultJson.Country + ", " + resultJson.Language
                + ", " + resultJson.Plot + ", " + resultJson.Actors + "\n";

            appendFile(log);
        }
    });
}

function readFile() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        var action = dataArr[0];
        var parameter = dataArr[1];

        option(action, parameter);

    });
}

function appendFile(textFile) {
    fs.appendFile("./log.txt", textFile, function (err) {

        // If an error was experienced we say it.
        if (err) {
            console.log(err);
        }

        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            console.log("Content Added!");
        }

    });
}