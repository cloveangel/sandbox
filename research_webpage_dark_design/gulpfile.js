var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pkg = require('./package.json');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

})

// Default task
gulp.task('default', ['vendor']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', ['browserSync'], function() {
  gulp.watch('./css/*.css', browserSync.reload);
  gulp.watch('./*.html', browserSync.reload);
});

(function() {
  'use strict';
  
  angular.module('delay-button', [])
    .directive('delayButton', DelayButton);
  
  function DelayButton($timeout, DelayButtonEventService) {
    return {
      restrict: 'E',
      templateUrl: 'modules/common/delay-button.html',
      transclude: true,
      scope: {
        click: '&?', // !!Optional, to check whether required requirement is met!!
        group: '@',
        styles: '=?',
        delay: '=?',
        disabled: '=?isDisabled',
        isVisible: '&?'
      },
      link: postLinkFn
    };
    
    function postLinkFn(scope) {
      var defaultDelay = 3000;
      scope.clickFn = clickFn;
      scope.isDisabled = isDisabled;
      activate();
      
      ///////
      
      function activate() {
        validateDirectiveRequirements();
        setStyles();
        setDelay();
        setDisabledState();
        checkVisibility();
        
        DelayButtonEventService.subscribeToClick(scope, callbackDelayFn, scope.group);
        
        function callbackDelayFn() {
          scope.disabled = true;
          $timeout(function() {
            scope.disabled = false;
          }, scope.delay);
        }
      }
      
      function clickFn() {
        DelayButtonEventService.notifyOfClick(scope.group);
        scope.click();
      }
      
      function isDisabled() {
        return scope.disabled;
      }
      
      function validateDirectiveRequirements() {
        var requiredScopeProperties = ['click'];
        requiredScopeProperties.forEach(function(requiredProperty) {
          if (angular.isUndefined(scope[requiredProperty])) {
            throw new Error('Property: [' + requiredProperty + '] missing!');
          }
        });
      }
      
      function setStyles() {
        var defaultStyles = ['btn', 'btn-default'];
        scope.styleClasses = angular.isDefined(scope.styles) ? scope.styles : defaultStyles;
      }
      
      function setDelay() {
        scope.delay = (scope.delay || defaultDelay);
      }
      
      function setDisabledState() {
        if (angular.isUndefined(scope.disabled)) {
          scope.disabled = false;
        }
      }
      
      function checkVisibility() {
        if (angular.isUndefined(scope.isVisible)) {
          scope.isVisible = function() {
            return true;
          };
        }
      }
    }
  }
})();

(function() {
  'use strict';
  
  describe('Module: delay-button', function() {
    var $compile, InnerDelayButtonEventService;
    
    beforeEach(module('templates-main'));
    beforeEach(module('pascalprecht.translate'));
    beforeEach(module('delay-button'));
    
    beforeEach(inject(function(_$compile_, DelayButtonEventService) {
      $compile = _$compile_;
      InnerDelayButtonEventService = DelayButtonEventService;
    }));
    
    function compileElement(elementString, $scope) {
      var element = $compile(elementString)($scope);
      $scope.$digest();
      return element;
    }
    
    describe('Directive: delayButton', function() {
      var $scope;
      
      beforeEach(inject(function($rootScope) {
        $scope = $rootScope.$new();
      }));
      
      it('should always have click property set', function() {
        var template = '<delay-button></delay-button>';
        expect(function() {
          compileElement(template, $scope);
        })
          .to.throw(Error);
        
        $scope.test = function() {};
        template = '<delay-button click="test()"></delay-button>';
        expect(function() {
          compileElement(template, $scope);
        })
          .to.not.throw(Error);
      });
      
      it.skip('should accept only static button text codes', function() {
        // @TODO add test
      });
      
      it.skip('can have group to limit delay area', function() {
        // @TODO add test
      });
      
      it.skip('can have styles passed in', function() {
        // @TODO add test
      });
      
      it.skip('can have different delay from the one set by default', function() {
        // @TODO add test
      });
      
      it.skip('can be disabled from outside', function() {
        // @TODO add test
      });
      
      it.skip('can be marked as invisible', function() {
        // @TODO add test
      });
    });
  });
})();
