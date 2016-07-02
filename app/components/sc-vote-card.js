import Ember from 'ember';

const {
  Component,
  computed: { notEmpty }
  get
} = Ember;

export default Component.extend({
  classNames: 'sc-vote-card',
  classNameBindings: ['isClickable:clickable'],
  isClickable: notEmpty('onSelect'),

  click() {
    let onSelect = get(this, 'onSelect');
    if (!onSelect) {
      return;
    }

    let value = get(this, 'value');
    let isSelected = get(this, 'isSelected');
    value = !isSelected ? value : undefined;
    onSelect(value);
  }
});
