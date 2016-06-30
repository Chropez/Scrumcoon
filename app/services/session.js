/* global localStorage */
import Ember from 'ember';
const {
  get,
  inject: { service },
  Service,
  set
} = Ember;

const USER_ID_KEY = 'sc_user_id_key';

export default Service.extend({
  store: service(),

  currentUser: null,

  setCurrentUser(user) {
    set(this, 'currentUser', user);

    if(user === null) {
      localStorage.removeItem(USER_ID_KEY);
      return;
    }

    localStorage.setItem(USER_ID_KEY, get(user, 'id'));

  },

  fetch() {
    let id = localStorage.getItem(USER_ID_KEY);
    if (id === null) {
      return;
    }

    return get(this, 'store').findRecord('user', id).then((user) => {
      if(user) {
        this.setCurrentUser(user);
        return user;
      }
    }).catch(() => {
      // No user was found
      this.close();
    });

  },

  close() {
    this.setCurrentUser(null);
  }

});
