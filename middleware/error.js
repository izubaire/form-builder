const path = require('path');
const rootDir = require('../utility/path');

module.exports = function (req, res, next) {
    // console.log(req.body);
    res.status(500).sendFile(path.join(rootDir, 'views', '404.html'));
}