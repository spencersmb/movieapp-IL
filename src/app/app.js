//MAIN APP FILE
angular.module('MovieApp', [
  'ui.router',
  'MovieApp.models.movies'
  //'MovieApp.models.users',
  //'MovieApp.models.categories'
])
.config(function($stateProvider, $urlRouterProvider) {
  //  $stateProvider
  //    .state('notewrangler', {
  //      url: '', //dont usee / in the url for main index
  //      abstract: true
  //      //templateUrl: 'app/categories/categories.tmpl.html',
  //      //controller: 'MainCtrl'
  //    });
  //
  //  $urlRouterProvider.otherwise('/')
  //})
  //Alternate state where all the views are in the same view
    $urlRouterProvider.otherwise('/movies');
    $stateProvider
      //.state('notewrangler',{
      //  url:'',
      //  //templateUrl:'app/movies/movies.tmpl.html'
      //  abstract:true
      //});
      .state('movies',{
        url:'/movies',
        templateUrl:'app/movies/movies.tmpl.html',
        controller: 'MoviesListCtrl',
        controllerAs:'ctrl'
      })
      .state('movieDetails',{
        url:'/movies/:movieTitle/:movieId',
        templateUrl:'app/movies/movieDetails/movieDetails.tmpl.html',
        controller:'MovieDetailsCtrl',
        controllerAs: 'ctrl'
      });
      //.state('edit',{
      //  url:'/movies/:noteId/edit',
      //  templateUrl:'app/movies/movieDetails/edit/edit.tmpl.html',
      //  controller:'NotesEditCtrl',
      //  controllerAs: 'ctrl'
      //})
      //.state('create',{
      //  url:'/movies/create',
      //  templateUrl:'app/movies/movieDetails/create/create.tmpl.html',
      //  controller:'NotesCreateCtrl',
      //  controllerAs: 'ctrl'
      //})
      //.state('users',{
      //  url:'/users',
      //  templateUrl:'app/users/users.tmpl.html',
      //  controller:'UsersListCtrl',
      //  controllerAs: 'ctrl'
      //})
      //.state('user-detail',{
      //  url:'/users/:userName',
      //  templateUrl:'app/users/userDetails/userDetails.tmpl.html',
      //  controller:'UserDetailsCtrl',
      //  controllerAs: 'ctrl'
      //});
      //.state('edit',{
      //  url:'/movies/:noteId/edit',
      //  views:{
      //    'editView@': {
      //      templateUrl:'app/movies/movieDetails/edit/edit.tmpl.html',
      //      controller:'NotesEditCtrl',
      //      controllerAs: 'ctrl'
      //    }
      //  }
      //
      //});
  })
;