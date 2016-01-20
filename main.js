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
      'A: {{collectionA}}',
      '<br>',
      'B: {{collectionB}}',
      '<br>',
      'C: {{collectionC}}',
    ].join('\n');
  }

  function link(scope, ele, attrs) {
    // OBJECTIVES:
    // COLD observables look like
    // HOT oservables look like
    // How to create substreams from a source
    // How to combine substreams and create a new stream out of it
    //
    // NOTES:
    // cold subscribe, hot connect - quick graphs
    // streamA, streamB, combinedStream
    // unsubscribe by dispose() subs
    // collections for output - safeApply
    // $timeout to delay subscribe streamB
    // streams can be proxies/interfaces for actual outputs
    // zip streams to create combinedStream

    var subA, subB, subC
    var source = rx.Observable.interval(1000);
    var hot = source.publish();
    var streamA = new rx.Subject();
    var streamB = new rx.Subject();
    var combinedStream;
    scope.collectionA = [];
    scope.collectionB = [];
    scope.collectionC = [];

    // source.subscribe(function(value) {
    //   // console.log(value);
    // })

    hot.subscribe(function(value) {
      streamA.onNext(value);
    })

    $timeout(function() {
      subB = hot.subscribe(function(value) {
        streamB.onNext(value + 100);
      })
    }, 5 * 1000);

    combinedStream = rx.Observable.zip(streamA, streamB, function(itemA, itemB) {
      return 'A: ' + itemA + ' ' + 'B: ' + itemB;
    })

    streamA.safeApply(scope, function(value) {
      scope.collectionA.push(value);
    })
      .subscribe();

    streamB.safeApply(scope, function(value) {
      scope.collectionB.push(value);
    })
      .subscribe();

    combinedStream.safeApply(scope, function(value) {
      scope.collectionC.push(value);
    })
      .subscribe();

    $timeout(function() {
      subB.dispose();
    }, 10 * 1000)

    hot.connect();
  }
}