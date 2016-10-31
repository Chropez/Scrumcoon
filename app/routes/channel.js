import Ember from 'ember';

const {
  computed: { alias },
  inject: { service },
  Route
} = Ember;

export default Route.extend({
  session: service(),
  channelService: service(),
  channel: alias('controller.model'),

  model({ channel_id }) {
    return this.store.findRecord('channel', channel_id).then((channel) => {
      return channel;
    }).catch(() => {
      let channelService = this.get('channelService');
      return channelService.createChannel({ id: channel_id });
    });
  },

  afterModel(channel) {
    return channel.get('channelUsers');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('session', this.get('session'));
  },

  joinChannel () {
    let channel = this.get('channel');
    let channelUsers = channel.get('channelUsers');

    let isAdmin = false;
    if (channelUsers.get('length') === 0 || !channelUsers.isAny('isAdmin', true)) {
      isAdmin = true;
    }

    this.get('channelService').addCurrentUser(channel, isAdmin);
  },

  removeUserVotes(channelUser) {
    let channelUserId = channelUser.get('id');
    let userVote = this.get('channel.currentStory.votes').findBy('channelUser.user.id', channelUserId);

    if (userVote) {
      let currentStory = this.get('votes').removeObject(userVote);
      currentStory.save().then(() => {
        userVote.destroyRecord();
      });
    }
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
        let channel = this.get('channel');
        channel.set('currentStory', story).save();
      });
    },

    kickUser(channelUser) {
      let channel = this.get('channel');

      this.removeUserVotes(channelUser);

      channel.reload().then((channel) => {
        channel.get('channelUsers').removeObject(channelUser);
        channel.save().then(() => {
          //channelUser.destroyRecord();
          if (channelUser.get('isMe')) {
            this.get('session.currentUser').destroy();
            this.get('session').close();
          }
        });
      });
    },

    joinChannel() {
      this.joinChannel();
    },

    saveStoryTitle() {

    },

    cancelStoryTitle() {

    }
  }
});
