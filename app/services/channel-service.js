import Ember from 'ember';

const {
  A,
  assign,
  inject: { service },
  isEmpty,
  Service
} = Ember;

export default Service.extend({
  session: service(),
  store: service(),

  createChannel(channelObject = {}, storyObject = {}) {
    let currentUser = this.get('session.currentUser');
    let channelUsers = A();
    let store = this.get('store');

    let newChannelUser;
    if (!isEmpty(currentUser)) {
      newChannelUser = store.createRecord('channelUser', {
        user: currentUser,
        isAdmin: true,
        isObserver: false
      });
      channelUsers.pushObject(newChannelUser);
    }

    let newStory = store.createRecord('story', storyObject);
    let channelAttrs = assign(channelObject, {
      channelUsers,
      stories: [newStory],
      currentStory: newStory
    });

    let newChannel = store.createRecord('channel', channelAttrs);

    if (newChannelUser) {
      return newChannelUser.save().then(() => {
        return newStory.save().then(() => {
          return newChannel.save();
        });
      });
    }

    return newStory.save().then(() => {
      return newChannel.save();
    });
  },

  addCurrentUser(channel, isAdmin, isObserver) {
    let user = this.get('session.currentUser');
    return this.addUser(channel, user, isAdmin, isObserver);
  },

  addUser(channel, user, isAdmin = false, isObserver = false) {
    if (isEmpty(user)) {
      console.error(`Can't add current user to channel because the user is not logged in`);
      return;
    }

    let channelUser = this.get('store').createRecord('channelUser', {
      user, isAdmin, isObserver
    });

    channel.get('channelUsers').pushObject(channelUser);
    return channelUser.save().then(() => {
      return channel.save();
    });
  }
});
