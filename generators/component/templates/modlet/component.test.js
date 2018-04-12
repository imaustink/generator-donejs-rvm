import QUnit from 'steal-qunit'
import { ViewModel } from './<%= name %>'

// ViewModel unit tests
QUnit.module('<%= module %>')

QUnit.test('ViewModel will instantiate without errors and retruns an instance', function () {
  var vm = new ViewModel()
  QUnit.ok(vm instanceof ViewModel)
})
