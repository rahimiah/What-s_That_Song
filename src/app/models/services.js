'use strict';

angular.module('player')
  .service('Player', function($http){
    var service = this;
    service.tracks = [];

    var extract = function (result){
      return result.data;
    };

    service.createEntry = function(input,song,artist){
      return $http({
        method: "POST",
        url: '/api/search',
        data: {
          content: input,
          song : song,
          artist: artist
        }
      })
      .success(extract)
      .error(function(err){
        console.log('error',err);
      });
    };

    service.findSong = function(lyrics){
      var query = {
        rootUrl: "http://api.lyricsnmusic.com/songs?api_key=",
        searchBy: "&q=",
        lyrics: lyrics,
        limit: "&per_page=5"
      };
      return $http.post('/api/song',query)
      .success(extract)
      .error(function(err){
        console.log('error',err);
      });
    };

    service.findYouTubeVideos = function (song){
      var query = {
        rootUrl: "https://www.googleapis.com/youtube/v3/search?part=id&maxResults=3&q=",
        //limiter for excessively long artist names/features
        artist: song.artist.split(",")[0] + " ",
        title: song.title,
        keyPrefix: "&key="
      };
      return $http.post('/api/videos',query)
      .success(extract)
      .error(function(err){
        console.log('error',err);
      });
    };
  });
