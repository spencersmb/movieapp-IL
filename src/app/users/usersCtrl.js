angular.module('MovieApp')

.controller('UsersListCtrl', function(UsersModel){
    var ctrl = this;

      UsersModel.getUsers().then(function (result) {
          ctrl.users = result;
      });

    })
;