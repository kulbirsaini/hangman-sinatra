var HangmanServices = angular.module("HangmanServices", []);

HangmanServices.factory("Hangman", ["$resource", "Config",
  function($resource, Config){

    var resource = $resource(Config.api_url + "/games/:id.json", { id: '@id' }, {
      get: { method: 'GET' },
      post: { method: 'POST' },
      query: { method: 'GET', isArray: true },
    });

    return resource;
  }
]);
