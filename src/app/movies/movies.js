
'use strict';

angular.module('MovieApp')
  //.config(function ($stateProvider) {
  //  $stateProvider
  //    .state('notewrangler.movies', {
  //      url: '/',
  //      views: {
  //        'mainView@': {
  //          controller: 'NotesListCtrl as ctrl',
  //          templateUrl: 'app/movies/movies.tmpl.html'
  //        }
  //      }
  //    })
  //})
  .controller('MoviesListCtrl', function (MoviesModel) {
    var ctrl = this;
    //rename movies to movies
    MoviesModel.getMovies().then(function (result) {
      ctrl.movies = result;
      console.log(result);
    });

    //Select Drop down
    ctrl.options = MoviesModel.options;

    //make dropdown start with alphabetical
    ctrl.descending = MoviesModel.options[0];

    //function to make release dates into sortable numbers
    ctrl.releaseDates =  MoviesModel.releaseDates;


  });

