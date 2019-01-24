const mongoose = require('mongoose')
mongoose.plugin(require("mongoose-ajv-plugin"))

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    pictureUrl: {
      type: String,
      'ajv-schema': {
        type: 'string',
        format: 'url'
      }
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    inHotspot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotspot',
      required: true
    },
    upVotes: {
      type: Number,
      default: 0
    },
    downVotes: {
      type: Number,
      default: 0
    },
    flagged: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)



const FIELDS_TO_POPULATE = [
  { path: 'inHotspot', select: 'title' },
  { path: 'addedBy', select: 'displayname' }
]

commentSchema.post('find', async (docs, next) => {
  for (let doc of docs) {
    await doc.populate(FIELDS_TO_POPULATE).execPopulate()
  }
  next()
})

commentSchema.post('save', (doc, next) => {
  doc.populate(FIELDS_TO_POPULATE).execPopulate().then(() => next())
})

commentSchema.statics.format = (comment) => {
  const formattedHotspot = { ...comment.inHotspot._doc }
  formattedHotspot.id = comment.inHotspot._id
  delete formattedHotspot._id
  const formattedComment = {
    ...comment._doc,
    id: comment._id,
    inHotspot: formattedHotspot
  }
  delete formattedComment._id
  delete formattedComment.__v
  return formattedComment
}

commentSchema.statics.formatForHotspot = (comment) => {
  const formattedComment = {
    ...comment._doc,
    id: comment._id,
    addedBy: {
      id: comment.addedBy._id,
      name: comment.addedBy.displayname
    }
  }
  delete formattedComment._id
  delete formattedComment.__v
  delete inHotspot
  return formattedComment
}

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment