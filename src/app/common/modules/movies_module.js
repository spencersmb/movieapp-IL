angular.module('MovieApp.models.movies', [

])
  .service('MoviesModel', function ($http, $q) {

    //Example object oriented API method - use for future
    var request = $http({
      url : 'http://data.tmsapi.com/v1.1/celebs/154505',
      method : 'GET',
      params : {'imageSize' : 'md','api_key':'ew825g4medr9bpfy7reqzd5t' }
    });

    //Set Current Date method
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    //if day is less add 0 to the number
    if( day < 10 ){
      day = '0'+day;
    }

    //if month is less add 0 to the number
    if( month < 10 ){
      month = '0'+ month;
    }

    var fullDate = year + '-' + month + '-' + day;

    //theater Variables
    var currentMovieId = '';
    var theaterAvalon = 10991;
    var urlFront = 'http://data.tmsapi.com/v1.1/theatres/';
    var showingsDate = '/showings?startDate='+fullDate;
    var urlEnd = '&imageSize=Lg&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t';
    var model = this,
      URL_Notes = {
        //FETCH: 'http://data.tmsapi.com/v1.1/theatres/10991/showings?startDate=2015-04-07&imageSize=Lg&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
        FETCH: urlFront + theaterAvalon + showingsDate + urlEnd
      },
      URL_Actors = {
        //FETCH: 'http://data.tmsapi.com/v1.1/movies/10679969/versions?imageSize=Md&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
        first: 'http://data.tmsapi.com/v1.1/movies/',
        last:'/versions?imageSize=Md&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
      },
      URL_Photos = {
        //FETCH: 'http://data.tmsapi.com/v1.1/movies/10679969/versions?imageSize=Md&imageText=true&api_key=ew825g4medr9bpfy7reqzd5t'
        first: 'http://data.tmsapi.com/v1.1/celebs/',
        last:'?imageSize=Md&api_key=ew825g4medr9bpfy7reqzd5t'
      },
      movies,
      photo = [],
      currentActors,
      currentMovie,
      actorId = [],
      myPhoto;

    //before we send data to ctrl - we extract it here
    function extract(result) {
      return result.data
    }

    function getnew(result){
      myPhoto = extract(result);
      //console.log(myPhoto);
      return myPhoto;
    }

    function cacheActors(result){
      currentActors = extract(result);
      //object returns array with the same content so remove all but the first array object
      currentActors = currentActors.pop();
      //console.log(currentActors);
      return currentActors;
    }

    function cacheMovies(result) {

      movies = extract(result);
      //loop through results and remove 2015 from the front of the date object, then reassign the new date to the original object
      angular.forEach(movies, function(note){

        var date = note.releaseDate;
        //return the date without the year infront of it
        date =_.without(date, year);

        //new date slie the first 5 elements which is year + -
        var newDate = date.slice(5);
        //rejoin enitre array into string
        var join = newDate.join("");
        //assign releasDate to new object properties
        note.releaseDate = join;

        //convert time to readable time function-pass time in on the DOM
        var newDuration;
        var duration = note.runTime;
        duration =_.without(duration, 'P','T','M');
        duration.shift();
        duration[1] = 'hr';
        duration.push('min');
        newDuration = duration.join("");

        //assign new string to object
        note.runTime = newDuration;
        //console.log(newDuration);

        return note;
      });

      return movies;
    }

    //special function for extracting promises from promis object that was done using $q
    //gett obj.data from each object and push it to a new variable to return so the next function can run .then() method.
    function extractArray(result){
      var newResult=[];
      angular.forEach(result, function(obj){
        newResult.push(obj.data);
      });
      return newResult;
    }

    //extract photos/actor name/ and actors name in movie
    //then reassign the properties onto an object and return that object for scope
    function cachePhotos(result) {
      photo = extractArray(result);

      var newArr=[];

      angular.forEach(photo, function(obj){

        var object ={};
        object.image = obj.preferredImage.uri;
        object.name = obj.name.first + " " + obj.name.last;

        //find the objects that matches the movie ID and return the charactername that matches
        _.find(obj.credits, function(c){
          if(c.rootId === currentMovieId){

            //if statement used to make sure the name is not undefined
            if(c.characterName){
              //console.log(c.characterName);
              object.characterName = c.characterName;
            }
          }
        });
        //push it all to new array.
        newArr.push(object);
      });

      //console.log(newArr);
      //console.log(photo);

      return newArr;
    }

    //APi call to get all the current movies
    model.getMovies = function(){
      return (movies) ? $q.when(movies) : $http.get(URL_Notes.FETCH).then(cacheMovies);
    };

    //function for looping through the returned results from what actors are in the movie then make an API call to get their photos using a loop + deferred promise.
    model.getMyPhotos = function(result){
      console.log(result);
      //create tmp array to store all promises
      var tmp = [];
      var deferred = $q.defer();

      angular.forEach(result, function(actorId){

        //for each actor make an api call
        //TODO:make new api call better here with method at top of page

        tmp.push($http.get(URL_Photos.first + actorId + URL_Photos.last).success(function(a){
          return deferred.resolve(a);
        }));

      });
      //console.log(tmp);
      //return the object using $q to release all the promises
      //then run cachePhotos to operate on the object before we pass it to the scope
      return $q.all(tmp).then(cachePhotos);

    };

    //API to get actors ID within the function "getCurrentActorsId"
    model.getActors = function(movieId){
      //console.log(currentMovie);
      //console.log(URL_Actors.first + currentMovieId + URL_Actors.last );
      return  $http.get(URL_Actors.first + movieId + URL_Actors.last).then(cacheActors);
    };

    model.getNew = function(){
      return request.then(getnew);
    };

    //2nd function that takes in the current ID from URL and runs the fetch to get the movieDetails from the json file that matches the ID in the url
    //set currentMoive and movieId to be used as a search function to get actorID in 2nd API call
    model.setCurrentMovie = function(movieId){
      //console.log('movie Id from mod' + movieId);
      //passing noteID success
      return model.getMovieById(movieId).then(function (movie) {
        //console.log(movie);
        currentMovie = movie;
        currentMovieId = movie.rootId;

      })
    };

    //example for getting a property
    //model.getCurrentNoteTitle = function () {
    //  return currentNote ? currentNote.title : ''
    //};


    //Get movie by title when user clicks on poster
    model.getMovieByTitle = function (movieTitle) {
      //console.log(movieTitle);

      //create a deferred object
      var deferred = $q.defer();

      function findId() {
        //finds a match if one exists when we call getCategoryByName
        return _.find(movies, function (c) {

          //console.log(c.rootId == movieTitle);
          return c.title == movieTitle;
        })
      }


      //if it exists just loop over it and resolve the promise with that value
      if(movies){

        deferred.resolve(findId());
      } else {
        //console.log('else');
        //if it doesnt make a call to the server then loop over it and return the promise
        model.getMovies().then(function (result) {
          deferred.resolve(findId());
        })
      }

      //then return that with a promise
      //console.log('promise' + deferred.promise);
      return deferred.promise;
    };

    model.getMovieById = function (movieId) {
      //console.log(movieTitle);

      //create a deferred object
      var deferred = $q.defer();

      function findId() {
        //finds a match if one exists when we call getCategoryByName
        return _.find(movies, function (c) {

          //console.log(c.rootId == movieTitle);
          return c.rootId == movieId;
        })
      }


      //if it exists just loop over it and resolve the promise with that value
      if(movies){

        deferred.resolve(findId());
      } else {
        //console.log('else');
        //if it doesnt make a call to the server then loop over it and return the promise
        model.getMovies().then(function (result) {
          deferred.resolve(findId());
        })
      }

      //then return that with a promise
      //console.log('promise' + deferred.promise);
      return deferred.promise;
    };

    //reset actor array on page change to clear it
    model.reset = function(){
      actorId=[];
    };

    //Get actorsId based on current Movie variable with API call to cast database
    //This is used as a comparing object to make an API call to get actors photos
    model.getCurrentActorsId = function(movieId){
      //console.log(movieId);

      var deferred = $q.defer();

      function findActorId() {

        //console.log(currentMovie);
        //console.log(currentActors.cast);
        angular.forEach(currentMovie.topCast, function(topCast){
          console.log(topCast);

          _.find(currentActors.cast, function(cast){
            //console.log(cast);
            //console.log(c);
            if(topCast == cast.name){
              actorId.push(cast.personId);
            }
          });

        });
        //console.log(actorId);
        return actorId;
      }

      //if it exists just loop over it and resolve the promise with that value
      if(currentMovie && currentActors ){
        //console.log('exist');
        //currentActors = [];
        //currentMovie= [];
        model.getActors(movieId).then(function (result) {
          deferred.resolve(findActorId());
        })

      } else {
        //console.log(currentMovieId);

        //console.log('else');
        //if it doesnt make a call to the server then loop over it and return the promise
        model.setCurrentMovie(movieId).then(function (result) {
          model.getActors(movieId).then(function (result) {
            deferred.resolve(findActorId());
          })
        })
      }


      return deferred.promise;
    };

    //options for sorting dropdown
    model.options = [
      //{label: 'Alphabetical', value: 'title'},
      {label: 'Alphabetical', value: 'title'},
      {label: 'Newest Movies', value: '-releaseDate'}
    ];

    //original release date function to make dates sortable
    //model.releaseDates = function(object){
    //  var date = object;
    //  date =_.without(object, '2015');
    //  //console.log(date);
    //  var newDate = object.slice(5);
    //  //var join = newDate.join("");
    //  //console.log(newDate);
    //  return newDate;
    //};

    //original time function that gave error with split();
    //model.time = function(dateTime){
    //
    //  var split = dateTime.split('');
    //  console.log(split);
    //  var removePt =_.without(split, 'P','T','M');
    //  //console.log(removePt);
    //  removePt.shift();
    //  //console.log(removePt);
    //  removePt[1] = 'hr';
    //  removePt.push('min');
    //  var comma = removePt.join("");
    //  comma.replace('H', 'Hours');
    //  return comma;
    //};


  });