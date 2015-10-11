// Sets the MongoDB Database options

module.exports = {

    mongolab:
    {
        name: "scotch-user-map-ec2",
        url: "mongodb://scotch:scotchrocks@ds051853.mongolab.com:51853/mean-map-app",
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
