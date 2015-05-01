angular.module('MovieApp.models.users', [

])
  .service('UsersModel', function ($http, $q) {
    var model = this,
      URLS = {
        FETCH: 'app/data/users.json'
      },
      users,
      currentUser;

    //before we send data to ctrl - we extract it here
    function extract(result) {
      return result.data
    }

    function cacheUsers(result) {
      users = extract(result);
      return users;
    }

    model.getUsers = function(){
      return (users) ? $q.when(users) : $http.get(URLS.FETCH).then(cacheUsers);
    };

    //2nd function that takes in the current ID from URL and runs the fetch to get the movieDetails from the json file that matches the ID in the url
    model.setCurrentUser = function(noteId){
      //console.log(noteId);
      //passing noteID success
      return model.getUserByNoteId(noteId).then(function (user) {
        //console.log(movieDetails);
        currentUser = user;
        //model.getNote = currentNote;
      })
    };

    model.getCurrentNoteTitle = function () {
      return currentUser ? currentUser.title : ''
    };


    //3rd run the promise
      model.getUserByNoteId = function (noteId) {
      //create a deferred object
      var deferred = $q.defer();

      function findId() {
        //finds a match if one exists when we call getCategoryByName
        return _.find(users, function (u) {
          //console.log(c.id == noteId); - true
          return u.id == noteId;
        })
      }


      //if it exists just loop over it and resolve the promise with that value
      if(users){
        //console.log('cached');
        deferred.resolve(findId());
      } else {
        //console.log('else');
        //if it doesnt make a call to the server then loop over it and return the promise
        model.getUsers().then(function (result) {
          deferred.resolve(findId());
        })
      }

      //then return that with a promise
      //console.log('promise' + deferred.promise);
      return deferred.promise;
    }

});