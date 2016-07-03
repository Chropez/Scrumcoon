import Ember from 'ember';

const {
  get,
  inject: { service },
  Route,
  RSVP: { all }
} = Ember;

export default Route.extend({
  session: service(),
  model({ channel_id }) {
    return this.store.findRecord('channel', channel_id );
  },

  joinChannel() {
    let channel = get(this, 'controller.model');
    let currentUser = get(this, 'session.currentUser');
    channel.get('users').addObject(currentUser);
    channel.save();
  },

  actions: {
    createUser(name) {
      this.store.createRecord('user', { name }).save().then((user) => {
        get(this, 'session').setCurrentUser(user);
        this.joinChannel();
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
      let hasVoted = get(this, 'controller.hasVoted');

      if(hasVoted) {
        let userVote = get(this, 'controller.userVote');
        let currentStoryId = get(this, 'controller.model.currentStory.id');
        this.store.findRecord('story', currentStoryId).then((currentStory) => {
          currentStory.get('votes').removeObject(userVote);
          currentStory.save().then(() => {
            userVote.destroyRecord();
          });
        });
      }

      channel.get('users').removeObject(currentUser);
      channel.save();

      get(this, 'session').close();
    },

    joinChannel() {
      this.joinChannel();
    },

    vote(value) {
      let user  = get(this, 'session.currentUser');
      let hasVoted = get(this, 'controller.hasVoted');
      let currentStoryId = get(this, 'controller.model.currentStory.id');

      if(hasVoted) {
        let userVote = get(this, 'controller.userVote');
        if (value) {
          userVote.set('value', value);
          userVote.save();
        } else {
          this.store.findRecord('story', currentStoryId).then((currentStory) => {
            currentStory.get('votes').removeObject(userVote);
            currentStory.save().then(() => {
              userVote.destroyRecord();
            });
          });
        }
      } else {
        this.store.findRecord('story', currentStoryId).then((currentStory) => {
          this.store.createRecord('vote', { value, user }).save().then((userVote) => {
            currentStory.get('votes').pushObject(userVote);
            currentStory.save();
          });
        });
      }
    },

    closeCurrentStory() {
      let currentStoryId = get(this, 'controller.model.currentStory.id');
      this.store.findRecord('story', currentStoryId).then((currentStory) => {
        currentStory.set('isClosed', true);
        currentStory.save();
      });
    },

    resetCurrentStory() {
      let currentStoryId = get(this, 'controller.model.currentStory.id');
      this.store.findRecord('story', currentStoryId).then((currentStory) => {
        let votes = get(currentStory, 'votes');
        let deletions = votes.map((vote) => {
          return vote.destroyRecord();
        });

        all(deletions).then(() => {
          currentStory.set('votes', []);
          currentStory.set('isClosed', false);
          currentStory.set('decision', null);
          return currentStory.save();
        });
      });
    }
  }
});
