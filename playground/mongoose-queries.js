const {ObjectID} =require("mongodb")
const {mongoose} = require ("./../server/db/mongoose")
const {Todo}= require ("./../server/models/todo")
var id ="acf0e71fa1956179c4f0a99"
if(!ObjectID.isvalid(id)){
  console.log("ID not Vaild")
}
Todo.find({
  _id: id
}).then((doc)=>{
  console.log('Todos:',doc)
}).catch((e)=>{console.log("id not found")})

Todo.findOne({
  _id:id
}).then((todo)=>{
  console.log('Todo',todo)
}).catch((e)=>{console.log("id not found")})

Todo.findById(id).then((doc)=>{
   console.log(doc)
}).catch((e)=>{console.log("id not found")})
