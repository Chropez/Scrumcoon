import Ember from 'ember';

const {
  Component,
  inject: { service }
} = Ember;

export default Component.extend({
  session: service(),
  classNames: 'sc-channel-users',

  actions: {
    leaveChannel() {
      return this.get('onLeaveChannel')();
    }
  }
});
