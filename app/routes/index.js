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
    createRoom() {
      let currentUser = get(this, 'session.currentUser');
      let users = A();
      if (!isEmpty(currentUser)) {
        users.pushObject(currentUser);
      }
      this.store.createRecord('channel', { name: 'new-channel', users }).save().then((channel) => {
        this.transitionTo('channel', channel.id);
      });
    }
  }
});
