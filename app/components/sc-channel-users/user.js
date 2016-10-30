import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  // inputs:
  // isAdmin : currentUser is admin
  // channelUser
  //
  actions: {
    kick(channelUser) {
      return this.get('onKickUser')(channelUser);
    },

    toggleAdmin(channelUser) {
      channelUser.toggleProperty('isAdmin');
      channelUser.save();
    },

    toggleObserver(channelUser) {
      channelUser.toggleProperty('isObserver');
      channelUser.save();
    }
  }
});
