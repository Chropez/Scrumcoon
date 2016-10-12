import Ember from 'ember';

const {
  A,
  assign,
  get,
  inject: { service },
  isEmpty,
  Service
} = Ember;

export default Service.extend({
  session: service(),
  store: service(),

  createChannel(channelObject = {}, storyObject = {}) {
    let currentUser = get(this, 'session.currentUser');
    let users = A();
    let store = this.get('store');

    if (!isEmpty(currentUser)) {
      users.pushObject(currentUser);
    }


    let newChannel = store.createRecord('story', storyObject);
    return newChannel.save().then((currentStory) => {
      let stories = [currentStory];
      var mergedChannelObject = assign(channelObject, {
        users,
        stories,
        currentStory
      });

      let channel = store.createRecord('channel', mergedChannelObject);
      return channel.save();
    });
  }
});
