const mongoose = require("mongoose")
var Todo = mongoose.model('Todo',{

  text: {
    type: String,
    required:true,
    minlength:1,
    trim:true
  },

  Completed:{
    type: Boolean,
    default:false
  },

  CompletedAt:{
    type: Number,
    default:null
  }
  
})

module.exports={Todo}
