const { Thought, User } = require('../models');

const thoughtController = {
  // GET /api/thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // GET /api/thoughts/:id
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id.' });
        }
        res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // POST /api/thoughts
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findByIdAndUpdate(
          req.body.userId,
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        res.json({ message: 'Thought created successfully.' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // PUT /api/thoughts/:id
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id.' });
        }
        res.json({ message: 'Thought updated successfully.' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE /api/thoughts/:id
  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.id)
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id.' });
        }
        return User.findByIdAndUpdate(
          thought.userId,
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id.' });
        }
        res.json({ message: 'Thought deleted successfully.' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // POST /api/thoughts/:thoughtId/reactions
  addReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this id.' });
        }
        res.json({ message: 'Reaction added successfully.' });
      })
      .catch((err) => res.status(500).json(err));
  },

  // DELETE /api/thoughts/:thoughtId/reactions/:reactionId
  removeReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true}
        )
        .then((thought) => {
          if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id.' });
          }
          res.json({ message: 'Reaction removed successfully.' });
        })
        .catch((err) => res.status(500).json(err));
    }
  };
  
  module.exports = thoughtController;
  
