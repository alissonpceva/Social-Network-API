const { User, Thought } = require('../models');

const userController = {
  // GET /api/users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // GET /api/users/:id
  getUserById(req, res) {
    User.findById(req.params.id)
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // POST /api/users
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // PUT /api/users/:id
  updateUser(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE /api/users/:id
  deleteUser(req, res) {
    User.findByIdAndDelete(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        // Remove user's associated thoughts
        return Thought.deleteMany({ username: user.username });
      })
      .then(() => res.json({ message: 'User and associated thoughts deleted successfully.' }))
      .catch((err) => res.status(500).json(err));
  },

  // POST /api/users/:userId/friends/:friendId
  addFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $push: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this userId.' });
        }
        res.json({ message: 'Friend added successfully.' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE /api/users/:userId/friends/:friendId
  removeFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this userId.' });
        }
        res.json({ message: 'Friend removed successfully.' });
      })
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;
