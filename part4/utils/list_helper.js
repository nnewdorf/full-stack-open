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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}