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

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('session', this.get('session'));
  },

  actions: {
    createUser(name) {
      this.store.createRecord('user', { name }).save().then((user) => {
        this.get('session').setCurrentUser(user);

        let channel = this.get('channel');
        let isAdmin = false;
        if (channel.get('channelUsers.length') > 0 ) {
          isAdmin = true;
        }

        this.get('channelService').addCurrentUser(channel, isAdmin);
      });
    },

    addStory() {
      this.store.createRecord('story').save().then((story) => {
        let channel = this.get('channel');
        channel.set('currentStory', story).save();
      });
    },

    leaveChannel() {
      let currentUser = this.get('session.currentUser');
      let currentUserId = currentUser.get('id');
      let channel = this.get('channel');
      let userVote = this.get('channel.currentStory.votes').findBy('user.id', currentUserId);
      let channelUser = this.get('channel.channelUsers').findBy('user.id', currentUserId);

      if (userVote) {
        let currentStory = this.get('votes').removeObject(userVote);
        currentStory.save().then(() => {
          userVote.destroyRecord();
        });
      }
      
      channel.get('channelUsers').removeObject(channelUser);
      channel.save();
      channelUser.destroyRecord();

      this.get('session').close();
    },

    joinChannel() {
      let channel = this.get('channel');
      this.get('channelService').addCurrentUser(channel);
    }
  }
});
