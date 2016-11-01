// Sets the MongoDB Database options

module.exports = {

    mongolab:
    {
        name: "mongolab",
        url: "mongodb://BigCoder:BigCoder!@ds139817.mlab.com:39817/heroku_cnkn5vpn",
        port: 27017
    },

    local:
    {
        name: "scotch-user-map-local",
        url: "mongodb://localhost/MeanMapApp",
        port: 27017
    },

    localtest:
    {
        name: "scotch-user-map-local",
        url: "mongodb://localhost/MeanMapAppTest",
        port: 27017
    }

};
