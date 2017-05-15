/*
* Generating Oauth1 link using oauthSignature.js
* This function use the configuration object from js/config.js
* Example:
*   input: 'GET', 'products'
*   output: http://www.mywebsite.com/api/products?oauth_consumer_key=ck_uhdiuhaifhieva320f5ea1f2afa
*                                                &oauth_signature_method=HMAC-SHA1
*                                                &oauth_timestamp=1126929805
*                                                &oauth_nonce=jaizHs
*                                                &oauth_version=1.0
*                                                &oauth_signature=op%2FEgKrIJh%2RxGRcOMurQ4S%2BiXSw%3D
*/

var generateNonce = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

var generateRequest = function(method, url, page, categorie) {
    var timestamp = Math.floor(new Date().getTime()/1000);
    var nonce = generateNonce(6);
    var parameters = {
        oauth_consumer_key: config.api.key,
        oauth_nonce: nonce,
        oauth_timestamp: timestamp,
        oauth_signature_method: config.api.signature,
        oauth_version: config.api.version
    };
    if(page) parameters.page = page;
    
    if(categorie) parameters['filter[product_cat]'] = categorie; 
    
    var link = config.api.link+url;

    var signature = oauthSignature.generate(method, link, parameters, config.api.secret);
    var authentification = '?oauth_consumer_key='+config.api.key+'&oauth_signature_method='+config.api.signature+'&oauth_version='+config.api.version+'&oauth_timestamp='+timestamp+'&oauth_nonce='+nonce+'&oauth_signature='+signature;
    var request = link+authentification;
    return request;
}