const expect =require ('expect')
const request = require('supertest')
const {ObjectID}=require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos',()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect( (res)=>{
        expect(res.body.text).toBe(text)
      })
      .end((err,res)=>{
        if(err){
          return done(err)
        }
        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text)
          done()
        }).catch((e)=> done(e))
      })
  })
  it("should not create todo with invalid data",(done)=>{
        request(app)
        .post('/todos')
        .set('x-auth',users[0].tokens[0].token)
            .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){return done(err)}

            Todo.find().then((todos)=>{
              expect(todos.length).toBe(2)
              done()
            }).catch((e)=>{done(e)})
         })// end end
  })//end it
})//end describe

describe("GET /todos",()=>{
  it("should get all todos",()=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(1)
    })
  })
})
 describe('GET/todos/id', () => {
  it("should not return todo doc created by other user",(done)=>{
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.doc.text).toBe(todos[0].text)
    })
    .end(done)
  })
  it("should return 404 if todo not found",(done)=>{
    var hexID = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${hexID}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done)
      })

  it("should return 404 for non-Object ids",(done)=>{
    request(app)
      .get('/todos/123abc')
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
});

describe("Delete/todos/:id",()=>{
  it('should remove a todo',(done)=>{
    var HexId = todos[0]._id.toHexString()
      request(app)
        .delete(`/todos/${HexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end((err,res)=>{
           if(err){
             return done(err)
           }
           Todo.findById(HexId).then((todo)=>{
             expect(todo).toBeTruthy();
             done()
           }).catch((e)=>{done(e)})
        })
  })
  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
})

describe('PATCH /todos/:id',()=>{
  it('should update the todo',(done)=>{
    var id = todos[0]._id.toHexString()
    var text ="This should be the new text"
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({
        Completed:true,
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toEqual(text)
        expect(res.body.todo.Completed).toBe(true)
        expect(res.body.todo.CompletedAt).toBe('number')
      }).end(done)
  })
})

describe('GET /users/me',()=>{
  it("should return user if authenticated",(done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })
  it('should return 401 if not authenticated',(done)=>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST/users', () => {
  it("should create User",(done)=>{
    var email = 'afsan@yahoo.com'
    var password = 'afsan007'
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy()
      expect(res.body._id).toBeTruthy()
      expect(res.body.email).toBe(email)
    })
    .end((err)=>{
      if(err){
        return done(err)
      }
      User.findOne({email}).then((user)=>{
        expect(user).toBeTruthy();
        // expect(user.password).toNotBe(password)
        done()
      })
    })
  })
});
describe("POST/user/login",()=>{
  it("should login user and return auth token",(done)=>{
  var email = users[1].email
  var password =users[1].password
    request(app)
    .post('/users/login')
    .send({
      email: email,
      password: password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy()
    })
    .end((err,res)=>{
      if(err){
        return done(err)
      }
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens[1]).toInclude({
          access:'auth'
        ,token:res.headers['x-auth']
        })
        done()
      }).catch((e)=>done(e))
    })
  })
  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1asd46'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e) => done(e));
    })
  })
})

describe('DELETE /users/me/token',()=>{
  it("should remove auth token on logout",(done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err)
      }
      User.findById(users[0]._id).then((user)=>{
        expect(user.tokens.length).toBe(0)
        done()
      }).catch((e)=>done(e))
    })
  })
})
