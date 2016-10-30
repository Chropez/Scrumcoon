import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Ember from 'ember';

const {
  computed,
  inject: { service }
} = Ember;

export default Model.extend({
    isAdmin: attr('boolean'),
    isObserver: attr('boolean'),
    user: belongsTo(),

    session: service(),

    isMe: computed('user.id', 'session.currentUser.id', function() {
      let userId = this.get('user.id');
      let sessionUserId = this.get('session.currentUser.id');
      return userId && userId === sessionUserId;
    })
});
