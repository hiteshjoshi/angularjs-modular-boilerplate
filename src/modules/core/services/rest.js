'use strict';

/**
 * Viewport Services
 * @module: app.core
 * @desc: Calculate application window width and height
 */
module.exports = function (module) {
  module.factory('api', ['$rootScope','$http', function ($rootScope,$http) {
    

  var parseUrl = "http://services.mysite.com";
 
  return {
    //Create a db object on server
    create: function(className, data, callback) {
      $http.post(
        parseUrl+'/classes/'+className,
        data,
        { headers: parseHeaders }
      )
      .success(function(response) {
        forge.logging.log("added object successfully!");
        $rootScope.$apply(function() { callback(null, response); });
      })
      .error(function(response) {
        forge.logging.log("error adding object!");
        $rootScope.$apply(function() { callback("Cannot submit data!"); });
      });
    },
    //Get a db object by id
    get: function(className, objectId, callback) {
 
      $http.get(
        parseUrl+'/classes/'+className+'/'+objectId,
        { headers: parseHeaders }
      ).success(function(response) {
        $rootScope.$apply(function() { callback(null, response); });
      }).error(function(response) {
        $rootScope.$apply(function() { callback(response.error || "Cannot get object "+className+"/"+objectId+"!"); });
      });
    },
    //Get a list of db objects with query
    query: function(className, query, callback) {
      var config = { headers: parseHeaders };
      if (query) config.params = { where: query };
      $http.get(
        parseUrl+'/classes/'+className,
        config
      ).success(function(response) {
        $rootScope.$apply(function() { callback(null, response); });
      }).error(function(response) {
        $rootScope.$apply(function() { callback(response.error || "Could not query "+className+"!"); });
      });
    },
    //Remove a db object
    remove: function(className, objectId, callback) {
      $http['delete']( //['delete'] to get around using delete js keyword
        parseUrl+'/classes/'+className+'/'+objectId,
        { headers: parseHeaders }
      ).success(function(response) {
        $rootScope.$apply(function() { callback(null, response); });
      }).error(function(response) {
        $rootScope.$apply(function() { callback(response.error || "Cannot delete object "+className+"/"+objectId+"!"); });
      });
    }
  };

  }]);
};