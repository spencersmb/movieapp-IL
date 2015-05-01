'use strict';

angular.module('NoteWrangler')
  .controller('NotesEditCtrl', function (NotesModel, UsersModel, CategoriesModel, $stateParams, $state) {
    var ctrl = this,
      noteId = $stateParams.noteId;

    function returnToNote(){
      $state.go('note', {
        //passs in param
        noteId: noteId
      })
    }

    function cancelUpdate(){
      returnToNote();
    }

    //pass in movieDetails id from URL first
    NotesModel.setCurrentNote(noteId);

    //get movieDetails by ID and set the obj available to the scope using stateParams
    //NotesModel.getNoteById(noteId).then(function (result) {
    //  ctrl.movieDetails = result;
    //  //Set current Category based on the movieDetails categoryID
    //  NotesModel.setCurrentCategory(ctrl.movieDetails.categoryId);
    //});


    function updateNote(){
      //define this.bookmark as the copy
      ctrl.note = angular.copy(ctrl.editedNote);
      //pass in the copy to updateBookmark function which just matches the index to the passed in bookmark and updates it
      NotesModel.updateNote(ctrl.editedNote);

      returnToNote();
    }


    NotesModel.getNoteById($stateParams.noteId)
      .then(function(result){

        if(result){
          //create reference
          ctrl.note = result;

          //edit the copy first for non-destructive editing
          ctrl.editedNote = angular.copy(ctrl.note);
        }else{
          returnToNote();
        }
      });

    ctrl.updateNote = updateNote;
    ctrl.cancelUpdate = cancelUpdate;
  });