angular.module('MovieApp.models.categories', [

])
  .service('CategoriesModel', function ($http, $q) {
    var model = this,
      URLS = {
        FETCH: 'app/data/categories.json'
      },
      categories,
      currentCategory;

    //before we send data to ctrl - we extract it here
    function extract(result) {
      return result.data
    }

    function cacheCategories(result) {
      categories = extract(result);
      //console.log(result);
      return categories;
    }

    model.getCategories = function(){
      return (categories) ? $q.when(categories) : $http.get(URLS.FETCH).then(cacheCategories);
    };

    //use this to pull out categories name from a 2nd data model avail on scope.
    model.getCurrentNoteCategoryName = function(notecatId){
      //finds a match if one exists when we call getCategoryByName
      currentCategory =  _.find(categories, function (c) {
        //console.log(c.id == notecatId);
        return c.id == notecatId;

      });
      return currentCategory;

    };

});