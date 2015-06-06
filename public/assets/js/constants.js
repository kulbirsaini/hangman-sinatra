angular.module("HangmanConfig.development", []).constant('Config', {
  api_url: 'http://localhost:4567',
});

angular.module("HangmanConfig.production", []).constant('Config', {
  api_url: 'http://yd9.net',
});
