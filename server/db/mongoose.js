var mongoose = require("mongoose")

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONOGDB_URI);

module.exports={mongoose}
