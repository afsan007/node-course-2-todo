require('./config/config')
const express =require("express")
const bodyParser = require("body-parser")
const  _ =require("lodash")
const {ObjectID}= require("mongodb")

const {mongoose} =require("./db/mongoose")
const {Todo} =require("./models/todo")
const {User} =require("./models/user")
const {authenticate}=require("./middelware/authenticate")
const app = express();
const port = process.env.PORT;

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
    if(!doc){ return res.status(404).send("is 2") }
    res.send({doc})

  }).catch((e)=>{
        res.status(400).send("is 3")
     })
})

app.delete('/todos/:id',(req,res)=>{
  var id = req.params.id
  if(!ObjectID.isValid(id)){
    return res.status(404).send("ID Is Not Valid.")
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
        return res.status(404).send("ID Is Not found.")
    }
    res.send({todo})

  }).catch((e)=>{ return res.status(404).send("Error occured!!")})
})


app.patch('/todos/:id',(req,res)=>{
  var id=req.params.id;
  var body =_.pick(req.body,['text','Completed'])
  if(!ObjectID.isValid(id)){
    return res.status(404).send("is 1")
  }
  if(_.isBoolean(body.Completed) && body.Completed){
    body.CompletedAt = new Date().getTime()
  }else{
    body.CompletedAt=null
    body.Completed = false
  }
  Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo})
  }).catch((e)=>{res.status(400).send()})
})


app.post('/users',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);

  user.save().then(() => {
      return user.generateAuthToken()
  }).then((token) => {
      res.header('x-auth',token).send(user)
  }).catch((e) => {
      res.status(400).send(e)
  })
})


app.get('/users/me',authenticate,(req,res)=>{
  res.send(req.user)
})


app.post('/users/login',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
        res.header('x-auth',token).send(user)
    })
  }).catch((e)=>{res.status(400).send()})
})


app.delete("/users/me/token",authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send()
  }).catch((e)=>{res.status(400).send()})
})

app.listen(3000, () => {
  console.log("Started on port 3000")
});


module.exports = {app}
