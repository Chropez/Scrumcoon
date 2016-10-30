import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sc-channel-users/user', 'Integration | Component | sc channel users/user', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sc-channel-users/user}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sc-channel-users/user}}
      template block text
    {{/sc-channel-users/user}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
