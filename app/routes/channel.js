import Ember from 'ember';

const {
  get,
  inject: { service },
  Route,
  set
} = Ember;

export default Route.extend({
  session: service(),
  model({ channel }) {
    return this.store.findRecord('channel', channel );
  },

  joinRoom() {
    let channel = get(this, 'controller.model');
    let currentUser = get(this, 'session.currentUser');
    channel.get('users').addObject(currentUser);
    channel.save();
  },

  actions: {
    createUser(name) {
      this.store.createRecord('user', { name }).save().then((user) => {
        get(this, 'session').setCurrentUser(user);
        this.joinRoom();
      });
    },

    addStory() {
      this.store.createRecord('story').save().then((story) => {
        let channel = get(this, 'controller.model');
        channel.set('currentStory', story).save();
      });
    },

    leaveChannel() {
      let currentUser = get(this, 'session.currentUser');
      let channel = get(this, 'controller.model');
      channel.get('users').removeObject(currentUser);
      channel.save();
      get(this, 'session').close();

    }
  }
});
