import Ember from 'ember';

const {
  A,
  Component,
  computed,
  computed: {
    alias,
    notEmpty
  },
  inject: { service },
  RSVP: { all }
} = Ember;

export default Component.extend({
  session: service(),
  store: service(),
  classNames: 'sc-channel-story',
  story: null,
  users: 0,
  currentVotes: alias('story.votes.length'),

  userVote: computed('story.votes.@each.value', 'session.currentUser.id', function() {
    let votes = this.get('story.votes');
    let currentUser = this.get('session.currentUser');

    if (!votes || !currentUser) {
      return;
    }

    return votes.findBy('user.id', currentUser.id);
  }),

  hasVoted: notEmpty('userVote'),

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
      let user  = this.get('session.currentUser');
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
        let vote = store.createRecord('vote', { value, user });
        story.get('votes').pushObject(vote);
        vote.save().then(() => {
          story.save();
        });
      }
    }
  }
});
