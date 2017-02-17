import Ember from 'ember';

const {
  Component,
  computed,
  computed: {
    notEmpty,
    oneWay
  },
  inject: { service }
 } = Ember;

export default Component.extend({
  // inputs:
  // isAdmin : currentUser is admin
  // channelUser
  store: service(),
  isChangingName: false,
  newName: oneWay('channelUser.user.name'),
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
    },

    changeName() {
      let newName = this.get('newName');
      this.get('store').findRecord('user', this.get('channelUser.user.id')).then((user) => {
        user.set('name', newName);
        this.toggleProperty('isChangingName');
        user.save();
      });
    },

    cancelChangeName() {
      this.set('newName', this.get('channelUser.user.name'));
      this.toggleProperty('isChangingName');
    }
  }
});
