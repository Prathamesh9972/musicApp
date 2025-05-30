function instructorOnly(req, res, next) {
  if (req.user && req.user.role === 'instructor') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Instructors only' });
  }
}

module.exports = { instructorOnly };
