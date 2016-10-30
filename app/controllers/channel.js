import Ember from 'ember';

const {
  Controller,
  computed,
  inject: { service }
} = Ember;
export default Controller.extend({
  session: service(),
  currentChannelUser: computed('model.channelUsers.@each.user.id', 'session.currentUser.id', function() {
    let channelUsers = this.get('model.channelUsers');
    let currentUserId = this.get('session.currentUser.id');
    return channelUsers.findBy('user.id', currentUserId);
  })
});
