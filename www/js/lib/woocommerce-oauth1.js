var encodeString = function (value) {
    return encodeURIComponent(value).replace("%5B", "%255B").replace("%5D", "%255D");
    //.replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
};

var genRandomNonce = function () {
    // Concatenating a random number to the date to avoid problems with concurrent calls
    var time = new Date().valueOf().toFixed().toString() + String(Math.random());

    // Hashing the timestamp to get a nonce, this way we can avoid conflicts.
    var s = sjcl.hash.sha256.hash(time);
    var hash = sjcl.codec.hex.fromBits(s);

    return encodeString(hash);
};

var prepareHTTPQueryString = function (http_method, url, CONFIG, extra_params) {
    // Oauth parameter list
    var oauth_params = {
        oauth_consumer_key: CONFIG.wc_consumer_key,
        oauth_nonce: genRandomNonce(),
        oauth_signature_method: CONFIG.oauth_signature_method,
        oauth_timestamp: (new Date().valueOf() / 1000).toFixed().toString(), // UNIX timestamp,
        oauth_version: "1.0"
    };

    for (var key in extra_params)
        oauth_params[key] = extra_params[key];

    // Start building signature base
    var scraped_url = url.replace("/index.php", "");
    var signatureBaseString = http_method + "&" + encodeURIComponent(scraped_url) + "&";

    var params = [];
    // Load key=value pairs into an array
    for (var key in oauth_params)
        params.push(encodeString(key + "=" + oauth_params[key] + '&'));

    // Lex sort
    params.sort();

    // Concat into signature base
    for (var v in params)
        signatureBaseString += params[v];

    // Remove the last ampersand (3 chars as it is already encoded)
    signatureBaseString = signatureBaseString.slice(0, -3);

    // Add an ampersand to the secret if using API v3 because as of 
    // version 3 the REST API fully conforms with the oauth 1.0a spec
    var consumer_secret = CONFIG.wc_consumer_secret;
    if (url.indexOf("wc-api/v3") != -1)
        consumer_secret = consumer_secret + '&';

    // SHA-256 support
    var key = sjcl.codec.utf8String.toBits(consumer_secret);
    var out = (new sjcl.misc.hmac(key)).mac(signatureBaseString);
    var signature = sjcl.codec.base64.fromBits(out);

    // SHA-1 support
    if (CONFIG.oauth_signature_method === 'HMAC-SHA1') {
        signature = oauthSignature.generate(http_method, scraped_url, oauth_params, CONFIG.wc_consumer_secret);
    }

    oauth_params['oauth_signature'] = encodeURIComponent(signature);

    url += '?';
    for (var key in oauth_params)
        url += key + '=' + oauth_params[key] + '&';
    url = url.slice(0, -1);

    return url;
};


var generateQuery = function (http_method, call, CONFIG, extra_params) {
    extra_params = extra_params || {};

    var json = CONFIG.site_url + CONFIG.wc_api_endpoint + call;

    // console.log(json, CONFIG);

    switch (CONFIG.site_url.split("://")[0]) {
        // Case http:
        case "http":
            json = prepareHTTPQueryString(http_method, json, CONFIG, extra_params);
            break;

        case "https":
            json += '?consumer_key=' + CONFIG.wc_consumer_key + '&consumer_secret=' + CONFIG.wc_consumer_secret;
            for (var key in extra_params)
                json += '&' + key + '=' + extra_params[key];
            break;

        default:
            throw Error("Given protocol is not supported.");
    }

    //console.log("Query json: " + json);
    return json;
};
