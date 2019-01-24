const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Hotspot = require('../models/hotspot')
const User = require('../models/user')
const { isUserLogged } = require('../utils/authentication')


commentsRouter.get('/', async (request, response) => {
  try {
    const comments = await Comment
      .find({})
    return response.json(comments.map(Comment.format))

  } catch (exception) {
    console.log(exception)

    return response.status(500).json({ error: 'Failed to retrieve comments.' })
  }
})

commentsRouter.get('/user=:userId', async (request, response) => {
  try {
    const comments = await Comment
      .find({ addedBy: request.params.userId })
    return response.json(comments.map(Comment.format))

  } catch (exception) {
    console.log(exception)

    if (exception.kind === 'ObjectId') {
      return response.status(400).json({ error: exception.message })
    }

    return response.status(500).json({ error: 'Failed to retrieve comments.' })
  }
})

commentsRouter.post('/', isUserLogged, async (request, response) => {
  try {
    const body = request.body
    const hotspot = await Hotspot.findById(body.inHotspot)

    if (!hotspot) {
      return response.status(404).json({ error: 'Comment could not be added because related hotspot not found.' })
    }

    const commentObject = {
      ...body,
      addedBy: request.user._id
    }

    const comment = new Comment(commentObject)
    const savedComment = await comment.save()

    hotspot.comments = hotspot.comments.concat(savedComment._id)
    await hotspot.save()

    return response.status(201).json(Comment.format(savedComment))

  } catch (exception) {
    console.log(exception)

    if (exception.name === 'ValidationError') {
      console.log(exception._message)
      const paths = Object.keys(exception.errors)
      console.log(paths)
      return response.status(400).json({ error: `Validation error: problem with ${paths.join(', ')}.` })

    } else if (exception.kind === 'ObjectId') {
      return response.status(400).json({ error: exception.message })

    }
    return response.status(500).json({ error: 'Failed to create comment.' })
  }
})

commentsRouter.delete('/:id', isUserLogged, async (request, response) => {
  try {
    const comment = await Comment.findById(request.params.id)

    // if comment wasn't found, it's probably deleted already
    if (!comment) {
      return response.status(204).end()
    }

    if (comment.addedBy.toString() !== request.user._id.toString()) {
      return response.status(403).json({ error: 'Comment created by another user.' })
    }

    const hotspot = await Hotspot.findById(comment.inHotspot)
    await comment.remove()

    if (hotspot) {
      hotspot.comments = hotspot.comments.filter(c => c.toString() !== request.params.id.toString())
      await hotspot.save()
    }

    return response.status(204).end()

  } catch (exception) {
    console.log(exception)

    if (exception.kind === 'ObjectId') {
      return response.status(400).json({ error: 'Malformed id.' })
    }
    return response.status(500).json({ error: 'Something went wrong while deleting comment.' })
  }
})

commentsRouter.patch('/:id', isUserLogged, async (request, response) => {
  try {
    const comment = await Comment.findById(request.params.id)
    const body = request.body

    if (!comment) {
      return response.status(404).json({ error: 'Comment not found.' })
    }

    if (comment.addedBy.toString() !== request.user._id.toString()) {
      return response.status(403).json({ error: 'Comment created by another user.' })
    }

    if (body._id) {
      delete body._id
    }
    console.log(body)
    for (let a in body) {
      comment[a] = body[a]
    }

    comment.save((error, updatedComment) => {
      if (error) {
        const paths = Object.keys(error.errors)
        return response.status(400).json({ error: `Comment validation error: problem with ${paths.join(', ')}.` })
      }
      return response.status(200).json(Comment.format(updatedComment))
    })

  } catch (exception) {
    console.log(exception)

    if (exception.kind === 'ObjectId') {
      return response.status(400).json({ error: 'Malformed id.' })
    }
    return response.status(500).json({ error: 'Failed to update comment' })
  }
})

module.exports = commentsRouter