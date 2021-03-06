import Ember from 'ember';

const {
  Component,
  computed,
  computed: {
    alias,
    filterBy,
    notEmpty,
    oneWay
  },
  inject: { service },
  RSVP: { all },
  run: { scheduleOnce }
} = Ember;

export default Component.extend({
  session: service(),
  store: service(),
  classNames: 'sc-channel-story',
  story: null,
  users: 0,
  isAdmin: alias('currentChannelUser.isAdmin'),
  currentVotes: alias('story.votes.length'),

  storyTitle: oneWay('story.title'),
  isEditingStoryTitle: false,

  userVote: computed('story.votes.@each.value', 'currentChannelUser.user.id', function() {
    let votes = this.get('story.votes');
    let currentUserId = this.get('currentChannelUser.user.id');

    if (!votes || !currentUserId) {
      return;
    }

    return votes.findBy('channelUser.user.id', currentUserId);
  }),

  hasVoted: notEmpty('userVote'),

  voters: filterBy('channelUsers', 'isObserver', false),

  actions: {
    closeVoting() {
      let story = this.get('story');
      story.set('isClosed', true);
      story.get('content').save();
    },

    resetStory() {
      let story = this.get('story');
      let votes = story.get('votes');
      let deletions = votes.map((vote) => {
        return vote.destroyRecord();
      });

      all(deletions).then(() => {
        story.set('votes', []);
        story.set('isClosed', false);
        story.set('decision', null);
        return story.get('content').save();
      });
    },

    vote(value) {
      let hasVoted = this.get('hasVoted');
      let story = this.get('story').get('content');

      if (hasVoted) {
        let userVote = this.get('userVote');

        if (value) {
          // If the user has voted, change the vote
          userVote.set('value', value);
          userVote.save();
        } else {
          // If the user has voted, remove the vote
          story.get('votes').removeObject(userVote);
          story.save().then(() => {
              userVote.destroyRecord();
          });
        }
      } else {
        // Create a new vote
        let store = this.get('store');
        let channelUser = this.get('currentChannelUser');
        let vote = store.createRecord('vote', { value, channelUser });
        story.get('votes').pushObject(vote);
        vote.save().then(() => {
          story.save();
        });
      }
    },

    showEditStoryTitle() {
      this.set('isEditingStoryTitle', true);

      scheduleOnce('afterRender', () => {
          this.$('.input__story-title input').focus();
      });
    },

    saveStoryTitle() {
      let story = this.get('story');
      story.set('title', this.get('storyTitle'));
      story.get('content').save();
      this.set('isEditingStoryTitle', false);
    },

    cancelStoryTitle() {
      this.set('storyTitle', this.get('story.title'));
      this.set('isEditingStoryTitle', false);
    }
  }
});
