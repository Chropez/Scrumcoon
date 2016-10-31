import Ember from 'ember';

const {
  Component,
  computed,
  computed: {
    notEmpty
  }
 } = Ember;

export default Component.extend({
  // inputs:
  // isAdmin : currentUser is admin
  // channelUser

  channelUserVotes: computed('votes.@each.channelUser.user.id', 'channelUser.user.id', function() {
    let votes = this.get('votes');
    let userId = this.get('channelUser.user.id');
    return votes.filterBy('channelUser.user.id', userId);
  }),

  hasVoted: notEmpty('channelUserVotes'),

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
