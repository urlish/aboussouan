var config = {
    title: 'Restaurant Aboussouan', // Title displayed in the app
    link: 'http://www.restaurantaboussouan.com', // Woocommerce homepage URL
    checkout: 'http://www.restaurantaboussouan.com/commande/', // Woocommerce checkout URL
    timeout: 20000, // Timeout of api calls in milliseconds
    api: {
        link: 'http://www.restaurantaboussouan.com/'+'wc-api/v3/', // API link
        key: 'ck_7445282e9cbf6c4c0877b16d3ad5dcebff570db6', // API customer key 
        secret: 'cs_d324c7c769ffc5417cf2376df70776c2bb1720ba', // API customer secret
        signature: 'HMAC-SHA1', // API signature algorithm
        version: '1.0' // OAuth Version
    },
    messages: { // HTML Allowed
        sale_text: 'Vente', // Text on the sale badge
        added_cart: 'Ajouté avec succès à votre panier!', // Message to show when a product is added to cart
        exists_cart: 'Le produit existe déjà dans votre panier!', // Message to show when a product already exists in cart
        server: 'Il y a eu un problème de connexion au serveur.<br> Veuillez réessayer plus tard !', // Message to show if there's no server connection
        no_internet: 'Vérifiez votre connexion Internet!', // Message to show if there's no internet connection
        empty: "Il n'y a aucun produit dans cette catégorie!", // Message to show if a categorie is empty
        empty_cart: "Il n'y a aucun article dans votre panier!", // Message to show if the user cart is empty
        empty_shop: "Le magasin est vide!", // Message to show if the website have no categories
        error: 'Une erreur inattendue s\'est produite!' // Generic error message
    },
    views: { // Views title
        homePage: 'Restaurant',
        cart: 'Panier'
    }
};
