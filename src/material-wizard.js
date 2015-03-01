/**
 * Created by Adel on 05.02.2015.
 */
(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name
   * @description
   */
  var mtWizard = angular.module('matesign.wizard', ['ngMaterial', 'ngAnimate']);
  mtWizard.directive('mtWizard', ['$timeout', '$document',
    function (timer, $document) {
      return {
        scope: {
          //UI
          btnBgColor: '@',
          activeBtnBgColor: '@',
          inactiveBtnBgColor: '@',
          btnProgressColor: '@',
          activeBtnProgressColor: '@',
          //Actions
          onFinish: '&'

        },
        restrict: 'E',
        transclude: true,
        controller: ['$scope', function ($scope) {
          $scope.selectedIndex = 0;
          $scope.curentStepTitle = "";
          var steps = $scope.steps = [];
          this.addStep = function (stepScope) {
            steps.push(stepScope);
            stepScope.progresscircleStyle = {"background-color": $scope.btnProgressColor};
            stepScope.wizardBtnStyle = {"background-color": $scope.btnBgColor};
            if (steps.length == 1) {
              setStepActive(stepScope, true);
            }
          };

          $scope.next = function () {
            $scope.goto(Math.min($scope.selectedIndex + 1, steps.length - 1));
          };

          $scope.previous = function () {
            $scope.goto(Math.max($scope.selectedIndex - 1, 0));
          };

          //Central function to select a step. All must go through it
          $scope.goto = function (stepNr) {
            if ($scope.stepPossible(stepNr)) {
              setStepActive(steps[$scope.selectedIndex], false);
              $scope.selectedIndex = stepNr;
              setStepActive(steps[stepNr], true);
            }
          };

          $scope.stepPossible = function (stepNr) {
            return steps[stepNr].canenter;
          };

          /**
           * @param stepScope
           * @param active set to true if current step else false
           */
          function setStepActive(stepScope, active) {
            stepScope.selected = active;
            $scope.curentStepTitle = active ? stepScope.title : "";
            stepScope.wizardBtnStyle = {"background-color": active ? $scope.activeBtnBgColor : $scope.btnBgColor};
          }
        }],
        template: function (scope, element, attributes) {
          var template =
            '<div layout="column" class="md-whiteframe-z1" layout-padding>' +
            ' <div layout="row"  layout-sm="column" layout-align="space-between start" layout-margin>' +
            '  <div><h3>{{curentStepTitle}}</h3></div>' +
            '  <div layout="row" layout-align="end center" layout-margin>' +
            '  <div  ng-repeat="step in steps" layout="row" layout-align="center center"  ng-click="goto($index)" >' +
            '   <md-button class="md-fab  wizard-button" aria-label="step button" ng-disabled="!step.canenter" >' +
            '     <div class="circle-loader-wrap" ng-style="step.progresscircleStyle"><div class="circle-loader-wrap after" ng-style="step.wizardBtnStyle" ></div></div>' +
            '     <div class="wizard-step-img"><md-icon md-svg-src="{{step.stepImg}}" class="icon"></md-icon></div>' +
            '     <md-progress-circular md-mode="determinate" md-diameter="63"  ng-value="{{step.stepFill}}"></md-progress-circular>' +
            '   </md-button>' +
            '   <md-progress-linear md-mode="determinate" value="0" md-mode="buffer" md-buffer-value="100" class="md-primary wizard-progress-linear" ng-show="$index<steps.length-1"></md-progress-linear >' +
            '  </div>' +
            '</div>' +
            ' </div>' +
            '<md-divider ></md-divider>' +
            ' <div layout="row"  class="wizard-container" ng-transclude ></div>' +
            ' <div layout="row" layout-align="end center" >' +
            '  <md-button class="md-fab wizard-chevron-left" aria-label="previous" ng-click="previous()" ng-show="selectedIndex > 0 "></md-button>' +
            '  <md-button class="md-fab wizard-chevron-right" aria-label="next" ng-click="next()" ng-show="selectedIndex < steps.length -1"></md-button>' +
            ' </div>';
          '</div>';
          return template;

        },
        link: function (scope, element, attrs) {
          var updateProgressStyle = function () {
            var progressBars = $document[0].querySelectorAll("md-progress-linear .md-container");
            angular.forEach(progressBars, function (progressBar) {
              angular.element(progressBar).css('background-color', scope.btnProgressColor);
            });
          };
          timer(updateProgressStyle, 0);
        }
      };
    }
  ])
  mtWizard.directive('mtWzStep', function () {
    return {
      require: '^mtWizard',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        title: '@',
        stepImg: '@',
        stepFill: '@',
        canenter: '=',
        onExit: '&'
      },
      template: '<div ng-show="selected"  ng-transclude layout-fill> </div>',
      link: function (scope, element, attrs, wizardCtrl) {
        scope.stepFill = 0;
        scope.nextProgressValue = 0;
        scope.$watch('canenter', function (value) {
          value ? scope.nextProgressValue = 100 : scope.nextProgressValue = 0;
        });
        wizardCtrl.addStep(scope);
      }
    };
  });
})();

