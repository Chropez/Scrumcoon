import Ember from 'ember';

const {
  Component,
  get,
} = Ember;

const CARDS = [
  '0', '½', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'coffee', '?'
];

export default Component.extend({
  classNames: 'sc-vote layout layout-align-center-center',
  voteCards: CARDS,
  actions: {
    vote(vote) {
      get(this, 'onVote')(vote);
    }
  }
});
