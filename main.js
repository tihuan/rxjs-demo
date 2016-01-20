angular
  .module('app', [
    'rx'
  ]);

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
      '<div>',
        '<h3>hello H3</h3>',
      '</div>'
    ].join('\n');
  }

  function link(scope, ele, attrs) {
    console.log('woohoo!');
  }
}