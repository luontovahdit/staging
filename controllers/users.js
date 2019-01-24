const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({})

    return response.status(200).json(users) // format...
  } catch (exception) {
    console.log(exception)
    return response.status(500).json({ error: 'Failed to retrieve users.' })
  }
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)

    return response.status(200).json(user) // format...
  } catch (exception) {
    console.log(exception)
    return response.status(500).json({ error: 'Failed to find user.' })
  }
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const user = new User(body)
    const savedUser = await user.save()
    return response.status(201).json(savedUser)
  } catch (exception) {
    console.log(exception)
    if (exception.name === 'ValidationError') {
      console.log(exception._message)
      const paths = Object.keys(exception.errors)
      console.log(paths)
      return response.status(400).json({ error: `Validation error: problem with ${paths.join(', ')}.` })
    } else {
      return response.status(500).json({ error: 'Failed to create user.' })
    }
  }
})

usersRouter.delete('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)

    // if user wasn't found, it's probably deleted already
    if (!user) {
      return response.status(204).end()
    }

    // TODO: What happens to user's hotspots and comments
    //       when user is removed?

    await user.remove()
    return response.status(204).end()

  } catch (exception) {
    console.log(exception)
    if (exception.kind === 'ObjectId') {
      return response.status(400).json({ error: 'Malformed id.' })
    }
    return response.status(500).json({ error: 'Something went wrong while deleting user.' })
  }
})


module.exports = usersRouter