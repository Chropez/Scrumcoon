import Ember from 'ember';

const {
  get,
  inject: { service },
  Route
} = Ember;

export default Route.extend({
  session: service(),
  channelService: service(),

  actions: {
    createChannel() {
      let channel = { name: 'Sprint #' };
      let story = { title: 'Story 1' };
      let channelService = get(this, 'channelService');

      channelService.createChannel(channel, story).then((channel) => {
        this.transitionTo('channel', channel);
      });
    },

    joinChannel(channelId) {
      this.store.findRecord('channel', channelId).then((channel) => {
        this.set('controller.channel', '');
        this.transitionTo('channel', channel);
      }).catch(() => {
        alert('Couldn\'t find the session with that Id.');
      });
    }
  }
});
