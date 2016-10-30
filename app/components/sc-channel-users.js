import Ember from 'ember';

const {
  Component,
  computed: { filterBy },
  inject: { service }
} = Ember;

export default Component.extend({
  session: service(),
  classNames: 'sc-channel-users',

  voters: filterBy('channelUsers', 'isObserver', false),
  observers: filterBy('channelUsers', 'isObserver', true),

  actions: {
    kickUser(channelUser) {
      this.get('onKickUser')(channelUser);
    }
  }
});
