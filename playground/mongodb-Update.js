const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
  if(err){
    return console.log('Unable to connect to the server')
  }
  console.log("/////////////////connected to Mongodb server/////////////////")

db.collection('Users').findOneAndUpdate(
  {_id:123456},
  {$inc:{age: +20}},
  {returnOrginal:true }
).then((res)=>{
  console.log(res)
})
db.close()
})
