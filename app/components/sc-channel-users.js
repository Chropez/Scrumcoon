import Ember from 'ember';

const {
  Component,
  get,
  inject: { service }
} = Ember;

export default Component.extend({
  session: service(),
  classNames: 'sc-channel-users',

  actions: {
    leaveChannel() {
      return get(this, 'onLeaveChannel')();
    }
  }
});
