const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    unique: true,
    required: true
  },
  name: String,
  passwordHash: { type: String, required: true},
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
    delete returnObject.passwordHash
  }
})


userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)