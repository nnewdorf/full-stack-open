const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./blog_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('when there are initial notes in database', () => {

  test('blogs are returned as json', () =>{
    api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('there are 6 blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })
  
  test('the first blog is the first of the initial blogs', async () => {
    const firstBlog = (await api.get('/api/blogs')).body[0]
    expect(firstBlog.title).toBe('React patterns')
    expect(firstBlog.author).toBe('Michael Chan')
    expect(firstBlog.url).toBe('https://reactpatterns.com/')
    expect(firstBlog.likes).toBe(7)
  })
  
  test('_id is changed to id when getting blogs', async () => {
    const blog = (await api.get('/api/blogs')).body[0]
    expect(blog.id).toBeDefined()
  })
})

describe('adding of a blog', () => {
  test('increases total number of blogs in database', async () => {
    const newPost = {
      title: 'A new blog',
      author: 'First last',
      url: 'https://aurl.com/',
      likes: 0
    }
  
    const oldNumberOfBlogs = (await helper.blogsInDb()).length
    const token = await helper.initToken()

    await api.post('/api/blogs')
      .send(newPost)
      .auth(token, { type: 'bearer'})

    const newNumberOfBlogs = (await helper.blogsInDb()).length

    expect(newNumberOfBlogs - oldNumberOfBlogs).toBe(1)
  })

  test('with missing token fails with 401 Unauthorized', async () => {
    const newPost = {
      title: 'A new blog',
      author: 'First last',
      url: 'https://aurl.com/',
      likes: 0
    }
  
    const oldNumberOfBlogs = (await helper.blogsInDb()).length

    await api.post('/api/blogs')
      .send(newPost)
      .expect(401)
  })

  test('with missing title or url will return 400 Bad Request', async () => {
    const newPost = {
      author: 'First last',
      url: 'https://aurl.com/',
      likes: 0
    }
  
    const token = await helper.initToken()
    const response = await api.post('/api/blogs')
      .send(newPost)
      .auth(token, {type: 'bearer'})

    expect(response.statusCode).toBe(400)
  
    const secondPost = {
      title: 'A new blog',
      author: 'First last',
      likes: 0
    }
  
    const secondResponse = await api.post('/api/blogs')
      .send(secondPost)
      .auth(token, {type: 'bearer'})
      
    expect(secondResponse.statusCode).toBe(400)
  })

  test('with missing likes field defaults to 0', async () => {
    const savedBlog = await new Blog({
      title: 'A new blog',
      author: 'First last',
      url: 'https://aurl.com/'
    }).save()
  
    expect(savedBlog.likes).toBe(0)
  })
})

describe('altering of a blog', () => {
  test('succeeds with 200 and returns the updated blog', async () => {
    const startBlogs = await helper.blogsInDb()
    const blogToUpdate = startBlogs[0]
    
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 32,
    }
  
    const response = await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)
  
    expect(response.body.likes).toBe(32)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const token = await helper.initToken()
    const newPost = {
      title: 'A new blog',
      author: 'First last',
      url: 'https://aurl.com/',
      likes: 0
    }
  
    const blogToDelete = await api.post('/api/blogs')
      .send(newPost)
      .auth(token, { type: 'bearer'})

    const startBlogs = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogToDelete.body.id}`)
      .auth(token, {type: 'bearer'})
      .expect(204)
  
    const endBlogs = await helper.blogsInDb()
  
    expect(endBlogs).toHaveLength(startBlogs.length-1)
    
    const allTitles = endBlogs.map(blog => blog.title)
    expect(allTitles).not.toContain(blogToDelete.title)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})