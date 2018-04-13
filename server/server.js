var express =require("express")
var bodyParser = require("body-parser")

var {ObjectID}= require("mongodb")
var {mongoose} =require("./db/mongoose")
var {Todo} =require("./models/todo")
var {User} =require("./models/user")

var app = express();

app.use(bodyParser.json())

app.post('/todos',(req,res)=>{
  var Tdo = new Todo({
    text:req.body.text
    ,Completed: req.body.Completed
  })
  Tdo.save().then((doc)=>{
    res.send(doc)
    console.log(`text: ${doc.text}`)
  },(e)=>{
    res.status(400).send(e)
  })
});

app.get("/todos",(req,res)=>{
  Todo.find().then( (todos) => {
    res.send({todos})
  },(e) => {
    res.status(400).send(e);
  })
})

app.get("/todos/:id",(req,res)=>{
  var id= req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send("is 1")
  }

  Todo.findById(id).then((doc)=>{
    if(!doc){
       return res.status(404).send("is 2")
    }
       res.send({doc})
}).catch((e)=>{
  res.status(400).send("is 3")
})

})

app.listen(3000, () => {
  console.log("Started on port 3000")
});

module.exports = {app}
