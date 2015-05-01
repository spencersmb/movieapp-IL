'use strict';

angular.module('NoteWrangler')
  .controller('NotesCreateCtrl', function (NotesModel, UsersModel, CategoriesModel, $stateParams, $state) {
    var ctrl = this,
      noteId = $stateParams.noteId;

    function returnToNote(){
      $state.go('notes', {
        //passs in param
        //noteId: noteId
      })
    }

    function cancelUpdate(){
      returnToNote();
    }

    function createNote(note){

      //createBookmark
      NotesModel.createNote(note);

      //return to bookmarkState
      //instead of hiding form after submit we redirect to this original state
      returnToNote();
    }

    ctrl.cancelUpdate = cancelUpdate;
    ctrl.createNote = createNote;

  });