const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
  if(err){
    return console.log('Unable to connect to the server')
  }
  console.log("/////////////////connected to Mongodb server/////////////////")

  db.collection('Users').findOneAndDelete({name:"Anderow"}).then((res)=>{
    console.log("Todos:")
    console.log(JSON.stringify(res))
  },(err)=>{
    console.log("Unable to fetch todocs",err)
  })

  db.close()
})
