const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})
   
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog =  new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user.id
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.id,
    comments: body.comments
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true, runValidators: true, context: 'query'}
  )

  response.json(updatedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  
  const blog = await Blog.findById(request.params.id)
  if(blog === null) {
    return response.status(400).json({error: 'blog not found'})
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(400).json({error: 'user can only delete their own blogs'})
  }

  await blog.remove()
  response.status(204).end()
})

blogRouter.post('/:id/comments', async (request, response) => {
  const comment = request.body.comment
  const blog = await Blog.findById(request.params.id)
  console.log(comment)
  blog.comments.push(comment)
  console.log(blog)
  const savedBlog = await blog.save()
  
  response.status(201).json(savedBlog)
})

module.exports = blogRouter
