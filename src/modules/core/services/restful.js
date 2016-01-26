'use strict';

/**
 * Viewport Services
 * @module: app.core
 * @desc: Calculate application window width and height
 */
//
module.exports = function (module) {
	module.factory('api', ['$rootScope','$http', function ($rootScope,$http) {
		//var parseUrl = 'http://localhost:8080';
		var parseUrl = 'http://careapi.demo.hatchitup.com';

		var parseHeaders = {}; //set Headers for JWTTOKEN


		var GenerateUrl = function(theClass,object,objectId){
			if(object && objectId){
				return parseUrl+ '/' + theClass + '/'+ object + '/' + objectId;
			}
			else{
				if(object){
					return parseUrl+ '/' + theClass + '/'+ object;
				}
				else{
					return parseUrl+ '/' + theClass;
				}
			}
		};

		return {
			//Create a db object on server
			post: function(theClass,object, data, callback) {

				$http.post(
					GenerateUrl(theClass,object,false),

					data,
					{ headers: parseHeaders }
				)
				.success(function(response) {


					callback(null,response);
				})
				.error(function(response) {

					callback(true,response || 'Cannot submit data!');
				});
			},
			put: function(theClass,object, objectId, data, callback) {

				$http.put(
					GenerateUrl(theClass,object,objectId),

					data,
					{ headers: parseHeaders }
				)
				.success(function(response) {

					callback(null,response);
				})
				.error(function(response) {

					callback(true,response || 'There is some problem with your data.');
				});
			},
			//Get a db object by id
			get: function(theClass,object, objectId, query,callback) {

				var config = { headers: parseHeaders };
				if (query){
					config.params = query;
				}
				$http.get(
					GenerateUrl(theClass,object,objectId),

					config
				).success(function(response) {

					callback(null,response);
				}).error(function(response) {

					callback(true,response || 'Some error occured.');
				});
			},
			//Remove a db object
			delete: function(theClass,object, objectId, callback) {

				$http['delete']( //['delete'] to get around using delete js keyword
					GenerateUrl(theClass,object,objectId),
					{ headers: parseHeaders }
				).success(function(response) {

					callback(null,response);
				}).error(function(response) {

					callback(true,response || 'Some error occured.');
				});
			}
		};
  	}]);
};