import Ember from 'ember';

const {
  Component,
  computed,
  get,
  inject: { service }
} = Ember;

export default Component.extend({
  session: service(),
  classNames: 'sc-channel-users',

  actions: {
    leaveChannel(user) {

    }
  }
});
