import Ember from 'ember';

const {
  Controller,
  computed,
  computed: { notEmpty },
  get,
  inject: { service }
} = Ember;

export default Controller.extend({
  session: service(),
  userVote: computed('model.currentStory.votes.@each.value', 'session.currentUser.id', function() {
    let votes = get(this, 'model.currentStory.votes');
    let currentUser = get(this, 'session.currentUser');

    if (!votes || !currentUser) {
      return;
    }

    return votes.findBy('user.id', currentUser.id);
  }),
  hasVoted: notEmpty('userVote')
});
