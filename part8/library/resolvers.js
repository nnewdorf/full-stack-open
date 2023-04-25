const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')

const jwt = require('jsonwebtoken')
const author = require('./models/author')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => (await Book.find({})).length,
    authorCount: async () => (await Author.find({})).length,
    allBooks: async (root, args) => {
      const query = {}
      if(args.genre) {
        query.genres = args.genre
      }
      
      const response = await Book.find(query).populate('author')

      return response
    },
    allAuthors: async (root, args, context, info) => {
      const authors = await Author.find({})
      const books = await Book.find({})
      authors.forEach(a => {
        a.bookCount = books.filter(
          b => b.author.equals(a._id)
        ).length
      })
      return authors
    },
    me: (root, args, context) => context.currentUser
  },
  // Author: {
  //   bookCount: async (root) => {
  //     const allBooks = await Book.find({}).populate('author')
  //     const ret = allBooks.filter(b => b.author.name === root.name).length
  //     return ret
  //   }
  // },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let author = await Author.findOne({name: args.author})
      let book = new Book({ ...args })

      if (!author) {
        author = new Author({ name: args.author })
        try{
          author = await author.save()
        } catch (error) {
          throw new GraphQLError('Adding book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
      }

      try{
        book.author = author._id
        book = await book.save()
      } catch (error) {
        throw new GraphQLError('Adding book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      book.author = author

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await Author.findOne({name: args.name})
      if (!author) {
        return null
      }
    
      author.born = args.setBornTo
      
      try{
        await author.save()
      }
      catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        return await user.save()
      } catch (error) {
        throw GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    login: async (root, args) => {

      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      const value = jwt.sign(userForToken, process.env.JWT_SECRET)
      return { value }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers