const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    /*
      //TODO We need email and password
      //TODO Check if the user already exists
      //TODO Salt their password
      //TODO Hash their password
      //TODO Save the user in the db
      //TODO Save the user to the session
      //TODO Send back confirmation of signup
    */

    const { email, password, isAdmin } = req.body
    const db = req.app.get('db')

    // We don't want to nest our entire function inside the .then
    // so we will use async and await in this function
    // db.get_user_by_email([email]).then(user => {
    //   .......
    // })

    // Check if the user exists in the database
    const user = await db.get_user_by_email([email])

    // If they exist we reject their request to register
    if (user[0]) {
      return res.status(409).send('User already exists')
    }

    // Generate salt for the password
    const salt = bcrypt.genSaltSync(10)

    // Run the password through the hashing algorithm
    const hash = bcrypt.hashSync(password, salt)

    // Save our user and hash to the db
    const newUser = await db.create_user([email, hash, isAdmin])

    // Establish the newly registered user on session
    req.session.user = newUser[0]

    // Send back confirmation of registration
    res.status(200).send(req.session.user)
  },
  login: async (req, res) => {
    /*
      //TODO We need email and password
      //TODO See if the user exists
      //TODO If they don't exist, we reject their request
      //TODO Compare their password to the hash
      //TODO If there is a mismatch, we reject their request
      //TODO Set the user on session
      //TODO Send confirmation of login
    */

    const { email, password } = req.body
    const db = req.app.get('db')

    // See if user already exists
    const existingUser = await db.get_user_by_email([email])

    // If they don't exist, we reject their request
    if (!existingUser[0]) {
      return res.status(404).send('User not found')
    }

    // Use bcrypt to compare the password they gave with the hash we have stored
    const isAuthenticated = bcrypt.compareSync(password, existingUser[0].hash)

    // If there is a mismatch, we reject their request
    if (!isAuthenticated) {
      return res.status(403).send('Email or password is incorrect')
    }

    // Remove the has property from the user object
    delete existingUser[0].hash

    // Set the logged in user on session
    req.session.user = existingUser[0]

    // Send confirmation of login
    res.status(200).send(req.session.user)
  },
  logout: (req, res) => {
    // Clear the existing session
    req.session.destroy()

    // Send confirmation
    res.sendStatus(200)
  },
  getSession: (req, res) => {
    // Check if a user is currently logged in
    if (req.session.user) {
      res.status(200).send(req.session.user)
    } else {
      res.status(404).send('No session found')
    }
  },
}
