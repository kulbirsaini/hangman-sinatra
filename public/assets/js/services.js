var HangmanServices = angular.module("HangmanServices", []);

HangmanServices.factory("Hangman", ["$resource", "Config",
  function($resource, Config){

    var timeout = 5000;
    var resource = $resource(Config.api_url + "/games/:id.json", { id: '@id' }, {
      get: { method: 'GET', timeout: timeout },
      post: { method: 'POST', timeout: timeout },
      query: { method: 'GET', isArray: true, timeout: timeout },
    });

    return resource;
  }
]);
