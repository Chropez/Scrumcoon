import Ember from 'ember';

const {
  get,
  inject: { service },
  Route
} = Ember;

export default Route.extend({
  session: service(),
  beforeModel() {
    let session = get(this, 'session');
    return session.fetch();
  }
});
