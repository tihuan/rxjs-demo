// main app
angular
  .module('app', [
    'rx'
  ]);

// output directive
angular
  .module('app')
  .directive('output', [
    '$timeout',
    'rx',
    output
  ]);

function output($timeout, rx) {
  var directive = {
    restrict: 'E',
    template: template,
    link: link
  }

  return directive

  function template(ele, attrs) {
    return [
      '<h1>RxJS ROCKS!</h1>',
      '{{collectionA}}',
      '<br>',
      '{{collectionB}}',
      '<br>',
      '{{collectionC}}',
    ].join('\n');
  }

  function link(scope, ele, attrs) {
    var subA, subB, subC
    var source = rx.Observable.interval(1000);
    var hot = source.publish();
    var streamA = new rx.Subject();
    var streamB = new rx.Subject();
    var combinedStream;
    scope.collectionA = [];
    scope.collectionB = [];
    scope.collectionC = [];

    hot
      .subscribe(function(value) {
        streamA.onNext(value + 1);
      });

    $timeout(function() {
      hot
        .subscribe(function(value) {
          streamB.onNext(value + 1);
        });
    }, 5 * 1000)

    combinedStream = rx.Observable
      .zip(
        streamA,
        streamB,
        function(itemA, itemB) {
          return 'A: ' + itemA + ' ' + 'B: ' + itemB;
        }
      );

    subA = streamA
      .safeApply(scope, function(itemA) {
        scope.collectionA.push(itemA);
      })
      .subscribe()

    subB = streamB
      .safeApply(scope, function(itemB) {
        scope.collectionB.push(itemB);
      })
      .subscribe()

    subC = combinedStream
      .safeApply(
        scope,
        function(result) {
          scope.collectionC.push(result);
        }
      )
      .subscribe()

    $timeout(function() {
      subA.dispose();
      subB.dispose();
      subC.dispose();
    }, 15 * 1000)

    hot.connect();
  }
}