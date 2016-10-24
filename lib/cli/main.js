'use strict';

Parse.Cloud.define('test', function (request, response) {
	Parse.Promise.as().then(function () {
		return Parse.Cloud.httpRequest({
			method: 'POST',
			url: Parse.serverURL + '/users',
			headers: {
				'X-Parse-Application-Id': 'appId',
				'X-Parse-Master-Key': 'masterKey',
				'X-Parse-REST-API-Key': 'restAPIKey',
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: {
				authData: {
					anonymous: {
						id: 1
					}
				}
			}
		});
	}).then(function (httpResponse) {
		response.success(httpResponse.text);
	});
});