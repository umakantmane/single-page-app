"use strict";

App.factory("site", ['$http', function($http) { 
 return {	

	'login':function(data) {
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": webServicesUrl+"oauth/token",
			"method": "POST",
			"headers": {
			"content-type": "application/x-www-form-urlencoded",
		},
			"data": jq.param(data)
		}
		return $http(settings);
	},
 	'signup':function(data) {
 		return $http.post(webServicesUrl+'signup', data);
 	},
 	'forgotPass':function(email) {
 		return $http.post(webServicesUrl+'forgotPassword', email);
 	},
 	'getUser':function(token) {
 		return $http.get(webServicesUrl+'getuser?access_token='+token);
 	},
 	'changepassword':function(data) {
 		return $http.post(webServicesUrl+'changePassword', data);
 	},
    'changepasswordTokenValidation':function(token) {
 		return $http.get(webServicesUrl+'changepasswordTokenValidation/'+token);
 	}

 };
    
}]);	