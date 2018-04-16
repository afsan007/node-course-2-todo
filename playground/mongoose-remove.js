const {ObjectID} =require("mongodb")
const {mongoose} = require("./../server/db/mongoose")
const {Todo}= require("./../server/models/todo")
--1--//
Todo.remove({}).then((res)=>{
  console.log(res)
})
Todo.findOneAndRemove({_id :'5ad067d54d96d616b8f7b146'}).then((res)=>{
  console.log(res)
})


Todo.findByIdAndRemove('5ad067d54d96d616b8f7b147').then((res)=>{
  console.log(res)
})
