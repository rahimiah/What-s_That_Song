'use strict'
angular.module('player')
  .controller('HomeCtrl', function(Player, YOUTUBE_EMBED, $timeout, $sce){
    var vm = this;
    vm.searchBar = false;
    vm.overlay = false;
    vm.refresh= true;
    vm.iframe = true;
    vm.loader = true;

    var randomGenerator = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    var stripWord = function (word){
      return word.replace(/['.,-\/#!$%\^&\*;:{}=\-_`~()]|<em>|<\/em>|\s/g,"");
    };

    var longestCommonSubstring = function(string1, string2){
    var comparisons = [];
    var maxSubStrLength = 0;
    var lastMaxSubStrIndex = -1, i, j, char1, char2, startIndex;
    for (i = 0; i < string1.length; ++i) {
      comparisons[i] = [];
      for (j = 0; j < string2.length; ++j) {
        char1 = string1.charAt(i);
        char2 = string2.charAt(j);
        if (char1 === char2) {
          if (i > 0 && j > 0) {
            comparisons[i][j] = comparisons[i - 1][j - 1] + 1;
          } else {
            comparisons[i][j] = 1;
          }
        } else {
          comparisons[i][j] = 0;
        }
        if (comparisons[i][j] > maxSubStrLength) {
          maxSubStrLength = comparisons[i][j];
          lastMaxSubStrIndex = i;
        }
      }
    }
    if (maxSubStrLength > 0) {
      startIndex = lastMaxSubStrIndex - maxSubStrLength + 1;
      return string1.substr(startIndex, maxSubStrLength);
    }
    return null;
  }

    var setAttr = function (songObject, title, lyrics, track,artist ){
       songObject.title = track.title;
       songObject.artist = track.artist.name;
       songObject.lyrics = lyrics;
       songObject.titlePartial = title;
       songObject.artistPartial = artist;
    };

     var matchSongName = function (input, trackList){
      var artist, title, lyrics;
      var entry = stripWord(input).toLowerCase();
      var song = {lyrics:'',artist:'',title:'',titlePartial:'',artistPartial:''};

      for (var i = 0; i < trackList.length; i++){
        var track = trackList[i];
        lyrics = !!track.context ? track.context : track.snippet;
        lyrics = stripWord(lyrics.replace(/(?:\r\n|\r|\n|)/g,"")).toLowerCase();
        artist = stripWord(track.artist.name).toLowerCase();
        title = stripWord(track.title).toLowerCase();
        //refine - expensive to find most common substrings from entry for each of the potential fields
        lyrics = longestCommonSubstring(entry,lyrics) || "";
        title = longestCommonSubstring(entry,title) || "";
        artist = longestCommonSubstring(entry,artist) || "";
        if (lyrics.length > song.lyrics.length){
          if (title !== song.titlePartial && title.length >= song.titlePartial.length){
            if (artist !== song.artistPartial && artist.length >= song.artistPartial.length){
              setAttr(song,title,lyrics,track,artist); 
            } else {
            setAttr(song,title,lyrics,track,artist);
          }
        } else if (artist !== song.artistPartial && artist.length >= song.artistPartial.length){
          setAttr(song,title,lyrics,track,artist); 
        }
      }
      else if (lyrics === song.lyrics){
        return song;
      } 
      else if (title === song.titlePartial || artist === song.artistPartial){
        return song;
      }
    }
      return song;
    };

    vm.trustSrc = function (src){
      return $sce.trustAsResourceUrl(src);
    };

    var embedVideo = function (song){
      vm.src = YOUTUBE_EMBED + song.trackID +  "?autoplay=1"
      vm.overlay = true;
      vm.iframe= false;
      vm.loader = true;
      $timeout(function(){
        vm.refresh = false;
      },6000);
      console.log('the song that matches your search', song);
    }

    var randomID = function (arr){
      var copy = arr.slice();
      var idx = randomGenerator(0,arr.length-1);
      var trackID = arr[idx].id.videoId;
      if (arr.length === 0){
        return null;
      }
      if (trackID){
        return trackID;
      } else {
        arr.splice(idx,1);
        return randomID(arr);
      }
    };

    vm.submit = function(text){
      vm.searchBar = true;
      vm.loader = false;

      Player.findSong(text)
       .then(function(res){
        vm.tracks = Player.tracks = res.data;
        vm.matchedSong = matchSongName(text,vm.tracks);
        
        Player.findYouTubeVideos(vm.matchedSong)
         .then(function(res){
           vm.matchedSong.ytUrls = res.data.items;
           vm.matchedSong.trackID = randomID(vm.matchedSong.ytUrls);
           embedVideo(vm.matchedSong);
         });

        Player.createEntry(text, vm.matchedSong.title, vm.matchedSong.artist ); 
       });

    
     };
  });
