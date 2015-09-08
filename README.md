# bending-angular-rules

## Tags

* `step-0` - the initial static HTML5 boilerplate with a list of names
* `step-1` - simple Angular application showing a list of names

## Start

Create a static page with HTML5 boilerplate code that shows a list of names
to greet, something like

    <!DOCTYPE html>
    <html>
    <head>
      <title>hello world</title>
    </head>
    <body>
      <h2>Hello</h2>
      <ul>
        <li>John</li>
        <li>Mary</li>
      </ul>
    </body>
    </html>

## Showing list of names: step-1

Let us allow the user to enter new names to be greeted. We will need to add an input text field
and a button. We can add them to our static markup for now

    <!DOCTYPE html>
    <html>
    <head>
      <title>hello world</title>
    </head>
    <body>
      <h2>Hello</h2>
      <ul>
        <li>John</li>
        <li>Mary</li>
      </ul>
      Enter a name <input type="text" /><button>Add</button>
    </body>
    </html>

Let us make this application live by adding a dash of Angular framework

    npm install angular

Add Angular controller to the page, it will be injected a special object `$scope` to hold
the list of names

    <!DOCTYPE html>
    <html>
    <head>
      <title>hello world</title>
      <script src="node_modules/angular/angular.js"></script>
      <script>
      angular.module('HelloApp', [])
        .controller('HelloController', function ($scope) {
          $scope.names = ['John', 'Mary'];
        });
      </script>
    </head>
    <body ng-app="HelloApp" ng-controller="HelloController">
      <h2>Hello</h2>
      <ul>
        <li ng-repeat="name in names track by $index">{{ name }}</li>
      </ul>
      Enter a name <input type="text" /><button>Add</button>
    </body>
    </html>

You need `track by $index` if you want to allow duplicate names in the list.
We can control the list of names to be shown from the outside. From the browser's console type

    angular.element(document.body).scope().names
    // ["John", "Mary"]
    angular.element(document.body).scope().names.push('Dave')
    angular.element(document.body).scope().$apply();
    // the list is reflected in the DOM

We can access the scope of any DOM element (or surrounding it) via `element.scope()` method.
Since the `$scope` is simply a plain object, to let Angular know we have modified it and would
like to see the changes, we need to call `scope.$apply()` method.


