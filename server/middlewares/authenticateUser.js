module.exports = {
  authenticateUser: (req, res, next) => {
    // Check if a user is currently logged in
    // if they are they can move to the next step
    if (req.session.user) {
      next()
    } else {
      res.status(403).send('Please log in')
    }
  },

  checkAdminStatus: (req, res, next) => {
    // Check if the current user is an admin
    // If they are they can move to the next step
    if (req.session.user.is_admin) {
      next()
    } else {
      res.status(403).send('You are not an admin')
    }
  },
}
