/* global encodeURI*/
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Model.extend({
  name: attr('string'),
  avatar: computed('name', function() {
    let encodedName = encodeURI(get(this, 'name'));
    return `https://api.adorable.io/avatars/70/${encodedName}`;
  })
});
