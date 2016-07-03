import Ember from 'ember';

const {
  A,
  get,
  inject: { service },
  isEmpty,
  Route
} = Ember;

export default Route.extend({
  session: service(),
  actions: {
    createChannel() {
      let currentUser = get(this, 'session.currentUser');
      let users = A();
      if (!isEmpty(currentUser)) {
        users.pushObject(currentUser);
      }

      this.store.createRecord('story', { title: 'Story 1' }).save().then((currentStory) => {
        let stories = [currentStory];
        let channel = this.store.createRecord('channel', {
          name: 'Sprint #',
          users,
          stories,
          currentStory
        });
        channel.save().then(() => {
          this.transitionTo('channel', channel);
        });
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
