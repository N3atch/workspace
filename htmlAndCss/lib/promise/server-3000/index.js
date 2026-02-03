const express = require('express')
const cors = require('cors')
const fs = require('fs').promises

const app = express()
app.use(cors())
app.use(express.json())

app.get('/websites', async function (req, res) {
  try {
    const websites = await fs.readFile('./db/websites.json')
    const response = JSON.parse(websites)
    console.log('websites')
    console.log(response)
    res.json(response)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.post('/bulk-users', async function (req, res) {
  try {
    const usersFilter = req.body
    const users = JSON.parse(await fs.readFile('./db/users.json'))
    const response = users.filter((user) => usersFilter.includes(user.id))
    console.log('bulk-users')
    console.log(response)
    res.json(response)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.get('/role/:id', async function (req, res) {
  try {
    const roleId = req.params.id
    const roles = JSON.parse(await fs.readFile('./db/roles.json'))
    const response = roles.filter((role) => role.id == roleId)[0]
    console.log('role')
    console.log(response)
    res.json(response)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.get('/', async function (req, res) {
  // return res.status(500).send()
  try {
    console.log('arrived')
    const users = await fs.readFile('./db/users.json')
    setTimeout(function () {
      console.log('callback invoked')
      res.json(JSON.parse(users))
    }, 5000)
    console.log('after subscription to setTimeout')
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.post('/', async function (req, res) {
  // return res.status(400).send()
  try {
    console.log('arrived')
    const newUsers = req.body
    const users = JSON.parse(await fs.readFile('./db/users.json'))
    console.log(users)
    for (const newUser of newUsers) {
      const user = { id: users.length + 1, ...newUser }
      users.push(user)
    }
    //comment it to avoid live server be refreshed
    // await fs.writeFile('./db/users.json', JSON.stringify(users), 'utf8')
    setTimeout(function () {
      console.log('callback invoked')
      console.log(users)
      res.json(users)
    }, 5000)
    console.log('after subscription to setTimeout')
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

app.listen(3000, () => {
  console.log('server is listening on port 3000')
})
