import Ember from 'ember';

const {
  get,
  inject: { service },
  Route,
  RSVP: { all }
} = Ember;

export default Route.extend({
  session: service(),
  channelService: service(),

  model({ channel_id }) {
    return this.store.findRecord('channel', channel_id).then((channel) => {
      return channel;
    }).catch(() => {
      let channelService = this.get('channelService');
      return channelService.createChannel({ id: channel_id });
    });

  },

  joinChannel() {
    let channel = this.get('controller.model');
    let currentUser = this.get('session.currentUser');
    channel.get('users').addObject(currentUser);
    channel.save();
  },

  actions: {
    createUser(name) {
      this.store.createRecord('user', { name }).save().then((user) => {
        this.get('session').setCurrentUser(user);
        this.joinChannel();
      });
    },

    addStory() {
      this.store.createRecord('story').save().then((story) => {
        let channel = this.get('controller.model');
        channel.set('currentStory', story).save();
      });
    },

    leaveChannel() {
      let currentUser = this.get('session.currentUser');
      let channel = this.get('controller.model');
      let hasVoted = this.get('controller.hasVoted');

      if(hasVoted) {
        let userVote = this.get('controller.userVote');
        this.get('controller.model.currentStory').then((currentStory) => {
          currentStory.get('votes').removeObject(userVote);
          currentStory.save().then(() => {
            userVote.destroyRecord();
          });
        });
      }

      channel.get('users').removeObject(currentUser);
      channel.save();

      this.get('session').close();
    },

    joinChannel() {
      this.joinChannel();
    },

    vote(value) {
      let user  = this.get('session.currentUser');
      let hasVoted = this.get('controller.hasVoted');

      if(hasVoted) {
        let userVote = this.get('controller.userVote');
        if (value) {
          userVote.set('value', value);
          userVote.save();
        } else {
          this.get('controller.model.currentStory').then((currentStory) => {
            currentStory.get('votes').removeObject(userVote);
            currentStory.save().then(() => {
              userVote.destroyRecord();
            });
          });
        }
      } else {
        this.get('controller.model.currentStory').then((currentStory) => {
          this.store.createRecord('vote', { value, user }).save().then((userVote) => {
            currentStory.get('votes').pushObject(userVote);
            currentStory.save();
          });
        });
      }
    },

    closeCurrentStory() {
      this.get('controller.model.currentStory').then((currentStory) => {
        currentStory.set('isClosed', true);
        currentStory.save();
      });
    },

    resetCurrentStory() {
      this.get('controller.model.currentStory').then((currentStory) => {
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
