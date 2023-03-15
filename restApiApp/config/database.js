const mongoose = require('mongoose');
const mongoDatabase = 'mongodb://localhost/restApiApp';

mongoose.connect(mongoDatabase);
mongoose.Promise = global.Promise;
module.exports = mongoose;