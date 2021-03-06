Untappd = {};

Untappd.requestCredential = function (options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config =
    ServiceConfiguration.configurations.findOne({ service: 'untappd' });

  if (!config) {
    if (credentialRequestCompleteCallback) {
      credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
    }

    return;
  }

  var credentialToken = Random.secret();
  var loginStyle = OAuth._loginStyle('untappd', config, options);
  // var scope = (config.scope) || ['basic', 'likes', 'relationships', 'comments'];

  if (typeof scope === 'string') {
    scope = [scope];
  }

  var flatScope = _.map(scope, encodeURIComponent).join('+');

  var absoluteUrlOptions = {};
  var rootUrl = this.rootUrl();
  if (rootUrl) {
    absoluteUrlOptions.rootUrl = rootUrl;
  }

  var uri = OAuth._redirectUri('untappd', config, null, absoluteUrlOptions);

  var loginUrl = 'https://untappd.com/oauth/authenticate' +
    '?client_id=' + config.clientId +
    '&response_type=code' +
    // '&scope=' + flatScope +
    '&redirect_url=' + uri.replace('?close', '') +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "untappd",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};

// override this method to set the root redirect URL
// useful for multi-tenant environments
Untappd.rootUrl = function () { /* noop */ };
