import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    createRoom() {
      this.store.createRecord('channel', { name: 'new-channel ' }).save().then((channel) => {
        this.transitionTo('channel', channel.id);
      });
    }
  }
});
