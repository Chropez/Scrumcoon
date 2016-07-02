import Ember from 'ember';

const {
  Component,
  computed: { alias },
  get
} = Ember;

export default Component.extend({
  classNames: 'sc-channel-story',
  currentVotes: alias('story.votes.length'),

  actions: {
    closeVoting() {
      get(this, 'onCloseVoting')();
    },
    resetStory() {
      get(this, 'onResetStory')();
    }
  }
});
