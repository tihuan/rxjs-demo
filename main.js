// main app
angular
  .module('app', [
    'rx'
  ]);

// output directive
angular
  .module('app')
  .directive('output', [
    'rx',
    output
  ]);

function output(rx) {
  var directive = {
    restrict: 'E',
    template: template,
    link: link
  }

  return directive

  function template(ele, attrs) {
    return [
      '<h1>RxJS ROCKS!</h1>',
      '<div ng-repeat="itemA in streamA">',
        '{{itemA}}',
      '</div>',
      '<br>',
      '<div ng-repeat="itemB in streamB">',
        '{{itemB}}',
      '</div>',
      '<br>',
      '<div ng-repeat="combinedItem in combinedStream">',
        '{{combinedItem}}',
      '</div>'
    ].join('\n');
  }

  function link(scope, ele, attrs) {
    var source = rx.Observable.interval(1000);
    scope.streamA = []
    scope.streamB = [4, 5, 6];

    source
      .safeApply(
        scope,
        function(value) {
          console.log('value here:');
          console.log(value);
          scope.streamA.push(value);
          console.log(scope.streamA);
        })
      .subscribe();

    scope.combinedStream = ['a', 'b', 'c'];
  }
}