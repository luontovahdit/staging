const mongoose = require('mongoose')
const validation = require('../utils/validation')
const Comment = require('../models/comment')

const hotspotSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: t => t.length > 0
    },
    description: {
      type: String,
      required: true,
      validate: d => d.length > 0
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: { // GeoJSON
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: { 
          validator: c => validation.validateCoordinates(c)
        }
      }
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
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  { timestamps: true }
)

const FIELDS_TO_POPULATE = [
  { path: 'comments', select: '-inHotspot' },
  { path: 'addedBy', select: 'displayname' }
]

hotspotSchema.post('find', async (docs, next) => {
  for (let doc of docs) {
    await doc.populate(FIELDS_TO_POPULATE).execPopulate()
  }
  next()
})

hotspotSchema.post('save', (doc, next) => {
  doc.populate(FIELDS_TO_POPULATE).execPopulate().then(() =>  next())
})

hotspotSchema.statics.formatWithComments = (hotspot) => {
  const formattedComments = hotspot.comments.map(Comment.formatForHotspot)
  const formattedHotspot = {
    ...hotspot._doc,
    id: hotspot._id,
    comments: formattedComments,
    addedBy: {
      id: hotspot.addedBy._id,
      name: hotspot.addedBy.displayname
    }
  }
  delete formattedHotspot._id
  delete formattedHotspot.__v
  return formattedHotspot
}

const Hotspot = mongoose.model('Hotspot', hotspotSchema)

module.exports = Hotspot