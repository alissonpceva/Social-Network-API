// date.js

const User = require('./models/User');
const Thought = require('./models/Thought');

// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

// Function to format user's thoughts
async function formatUserThoughts(user) {
  const formattedThoughts = [];

  for (const thoughtId of user.thoughts) {
    const thought = await Thought.findById(thoughtId);
    formattedThoughts.push({
      _id: thought._id,
      thoughtText: thought.thoughtText,
      createdAt: formatDate(thought.createdAt),
      username: thought.username
    });
  }

  return formattedThoughts;
}

// Function to format user's friends
async function formatUserFriends(user) {
  const formattedFriends = [];

  for (const friendId of user.friends) {
    const friend = await User.findById(friendId);
    formattedFriends.push({
      _id: friend._id,
      username: friend.username
    });
  }

  return formattedFriends;
}

module.exports = {
  formatDate,
  formatUserThoughts,
  formatUserFriends
};
