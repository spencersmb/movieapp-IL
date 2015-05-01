'use strict';

angular.module('MovieApp')
  //.config(function ($stateProvider) {
  //  $stateProvider
  //    .state('notewrangler.movies.movieDetails', {
  //      url: 'movies/:noteId',
  //      views: {
  //        'mainView@': {
  //          controller: 'NotesCtrl as ctrl',
  //          templateUrl: 'app/movies/movieDetails/movieDetails.tmpl.html'
  //        }
  //      }
  //    })
  //})
  .controller('MovieDetailsCtrl', function (MoviesModel, $stateParams, $state) {
    var ctrl = this,
      movieTitle = $stateParams.movieTitle,
      movieId = $stateParams.movieId;
    //console.log($stateParams.movieId);


    //pass in movieDetails id from URL first
    //ctrl.getCurrentActorsId = MoviesModel.getCurrentActorsId;

    //STEP 1::::::::::
    //get movieDetails by title and set the obj available to the scope using stateParams
    MoviesModel.getMovieByTitle(movieTitle).then(function (result) {
      ctrl.note = result;

      //Set the current movie passing in movieId from the stateparams
      MoviesModel.setCurrentMovie(movieId);

      //console.log(ctrl.note);
    });

    //STEP 2::::::::::
    //Make api call to get movie cast and compare against top cast in CurrentMovie.
    MoviesModel.getCurrentActorsId(movieId).then(function (result) {

      //STEP 2.5::::::::::
      //pass actors ID's into the function to get photos
      MoviesModel.getMyPhotos(result).then(function(actors){
        ctrl.actors = actors;
        //console.log(actors); //contains cast memeber name and role they play in movie

      });

    });

    //Example for object oriented api call - use this method in future
    //MoviesModel.getNew().then(function(result){
    //  //console.log(result);
    //});

    //go to index state
    function returnToMovies(){
      $state.go('movies', {
        //passs in param
        //noteId: noteId
      })
    }

    //btn funcction
    function goBack(){
      returnToMovies();
      //reset movie variables storing actors id's
      ctrl.reset();
    }

    //Set functions on the Dom
    ctrl.goBack = goBack;

    ctrl.reset = MoviesModel.reset;

  });