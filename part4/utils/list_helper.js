// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, currentBlog) => total + currentBlog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) {
    return {}
  }

  const favoriteIndex = blogs.reduce((favoriteIndex, currentBlog, currentIndex) =>
    blogs[favoriteIndex].likes > currentBlog.likes ? favoriteIndex : currentIndex, 0)

  return blogs[favoriteIndex]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {author: '', blogs: 0}
  }
  
  const authors = []
  const numBlogs = []
  let mostBlogsIndex = 0

  blogs.forEach(blog => {
    const authorIndex = authors.findIndex(author => blog.author === author)
    if (authorIndex !== -1) {
      numBlogs[authorIndex]++
      if(numBlogs[mostBlogsIndex] < numBlogs[authorIndex]) {
        mostBlogsIndex = authorIndex
      }
    } else {
      authors.push(blog.author)
      numBlogs.push(1)
    }
  })

  return {
    author: authors[mostBlogsIndex],
    blogs: numBlogs[mostBlogsIndex]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {author: '', likes: 0}
  }
  
  const authors = []
  const numLikes = []
  let mostLikesIndex = 0

  blogs.forEach(blog => {
    const authorIndex = authors.findIndex(author => blog.author === author)
    if (authorIndex !== -1) {
      numLikes[authorIndex] += blog.likes
      if(numLikes[mostLikesIndex] < numLikes[authorIndex]) {
        mostLikesIndex = authorIndex
      }
    } else {
      authors.push(blog.author)
      numLikes.push(blog.likes)
    }
  })

  return {
    author: authors[mostLikesIndex],
    likes: numLikes[mostLikesIndex]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}