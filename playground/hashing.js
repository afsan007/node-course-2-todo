const {SHA256} = require('crypto-js')
const jwt      = require("jsonwebtoken")
const bcrypt   = require('bcryptjs')


var password = "abc234"

// bcrypt.genSalt(100,(err,salt)=>{
//   bcrypt.hash(password,salt,(err,hash)=>{
//     console.log(hash)
//   })
// })


var hashedPassword ='$2a$10$FN3OqlfhPuv2T6OalNv7yunX7ysfRyhrGSZ1cRmB6W7r7kM.94YRG'

bcrypt.compare(password, hashedPassword, (err,res)=>{
  console.log(res)
})








// var data = {
//   id : 10
// }
//
// var token = jwt.sign(data,'123abc')
// console.log(token)
//
// var decoded = jwt.verify(token,'123abc')
// console.log(decoded)

// var message = 'Iam king of the programing'
// var hash = SHA256(message).toString()
//
// console.log(`Message: ${message}`)
// console.log(`hash:${hash}`)
//
// var data ={
//   id :4
// }
//
// var token ={
//   data,
//   hash:SHA256(JSON.stringify(data)+'somesecret').toString()
// }
//
// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString()
// if(resultHash === token.hash){
//   console.log('Data was not changed')
// }else{
//   console.log('Data was changed.Do not trust')
// }
