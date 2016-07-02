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

      this.store.createRecord('story', { title: 'Story 1' }).save().then((currentStory) => {
        let stories = [currentStory];
        this.store.createRecord('channel', {
          name: 'Spring #',
          users,
          stories,
          currentStory
        }).save().then((channel) => {
          this.transitionTo('channel', channel.id);
        });
      });
    }
  }
});
