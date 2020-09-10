module.exports = {
  getAdminSecret: (req, res) => {
    res.status(200).send('You are an admin, here is the secret')
  },
  getSecret: (req, res) => {
    res.status(200).send('You are logged in, here is your secret')
  },
}
