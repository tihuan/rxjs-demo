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

    // Create a promise which resolves 42
    var promise1 = new RSVP.Promise(function (resolve, reject) {
        resolve(42);
    });

    var source1 = Rx.Observable.fromPromise(promise1);

    var subscription1 = source1
      .map(function(result) {
        console.log('I got it!');
        console.log(result);
        return result
      })
      .subscribe(
        function (x) {
          console.log('Next: %s', x);
        },
        function (err) {
          console.log('Error: %s', err);
        },
        function () {
          console.log('Completed');
        })

    // Create a promise which rejects with an error
    var promise2 = new RSVP.Promise(function (resolve, reject) {
        reject(new Error('reason'));
    });

    var source2 = Rx.Observable.fromPromise(promise2);

    var subscription2 = source2
      .map(function(result) {
        console.log('I got it 2!');
        console.log(result);
        return result
      })
      .subscribe(
        function (x) {
          console.log('Next: %s', x);
        },
        function (err) {
          console.log('Error: %s', err);
        },
        function () {
          console.log('Completed');
        });
  }
}