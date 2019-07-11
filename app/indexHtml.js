var fs = require('fs');

// render index.html and replace MAPS_API_KEY
module.exports = function(app, publicDir) {
    var indexHtml = fs.readFileSync(publicDir + '/index.html').toString()
        .replace('%MAPS_API_KEY%', process.env.MAPS_API_KEY || 'AIzaSyDrn605l7RPadiwdzsOlRw9O28lxfYBJ6s');
    app.get('/', function(req, res) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(indexHtml);
    });
};
