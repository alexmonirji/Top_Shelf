const FollowingsFollowers = require('../db/models/followingsFollowers.js');
const Users = require('../db/models/users.js');

module.exports = {
  addFollowingFollower: async ({ following, follower }) => {
    try {
      let followingUser = await Users.findOne({ where: { username: following } })
      let followerUser = await Users.findOne({ where: { username: follower } })
      
      if (followingUser.id === followerUser.id) {
        throw null;
      }
      
      let [ data, created ] = await FollowingsFollowers.findOrCreate({
        where: {
          following_id: followingUser.id,
          follower_id: followerUser.id
        }
      });
      
      if (!created) {
        throw null;
      }
    } catch (err) {
      throw err;
    }
  },
  fetchUserFollowings: async (username) => {
    try {
      let data = [];
      let { id } = await Users.findOne({ where: { username: username } });
      let followings = await FollowingsFollowers.findAll({ where: { follower_id: id } });
      
      for (let i = 0; i < followings.length; i++) {
        let { dataValues } = await Users.findOne({ where: { id: followings[i].following_id } });
        data.push(dataValues);
      }
      
      return data;
    } catch (err) {
      throw err;
    }
  },
  fetchUserFollowers: async (username) => {
    try {
      let data = [];
      let { id } = await Users.findOne({ where: { username: username } });
      let followers = await FollowingsFollowers.findAll({ where: { following_id: id } });
      
      for (let i = 0; i < followers.length; i++) {
        let { dataValues } = await Users.findOne({ where: { id: followers[i].follower_id } });
        data.push(dataValues);
      }

      return data;
    } catch (err) {
      throw err;
    }
  },
  removeFollowingFollower: async ({ following, follower }) => {
    try {
      let followingUser = await Users.findOne({ where: { username: following } });
      let followerUser = await Users.findOne({ where: { username: follower } });
      
      let destroyed = await FollowingsFollowers.destroy({
        where: {
          following_id: followingUser.id,
          follower_id: followerUser.id
        }
      });

      if (!destroyed) {
        throw null;
      }
    } catch (err) {
      throw err;
    }
  },
};