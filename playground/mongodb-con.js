// const MongoClient = require('mongodb').MongoClient
// MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
//     if(err){
//       return console.log("Unable to connect to Mongodb server")
//     }
//     console.log("connect to the server sucessfully")
//     const dbo = db.db("project")
//     dbo.createCollection("customers",
//     {'test':'somethnig to do','completed': false},
//     (err,res)=> {
//         if(err){
//           return console.log("Unable to create",err)
//         }
//         console.log("create sucessfullygully")
// db.close()
//     })
// })

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  //Create a collection name "customers":
  dbo.createCollection("customers",{'test':'somethnig to do','completed': false}, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});
