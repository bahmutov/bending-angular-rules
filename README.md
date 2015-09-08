# bending-angular-rules

## Tags

* `step-0` - the initial static HTML5 boilerplate with a list of names
* `step-1` - simple Angular application showing a list of names
* `step-2` - adding the entered new name
* `step-3` - dynamically extend a method on the scope
* `step-4` - calling the server to get the new name
* `step-5` - mocking server responses using closure loophole

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

## Add entered name to the list: step-2

Let us connect our static input field and the button to the list of names.
We can change the HTML markup to bind the input value to the property `newName` on the `$scope`

    Enter a name <input type="text" ng-model="newName" />

And we can call a method on the `$scope` (see the pattern) whenever the user clicks the button

    <button ng-click="addName()">Add</button>

We need to write the `addName()` method, otherwise nothing is happening.

```js
.controller('HelloController', function ($scope) {
  $scope.names = ['John', 'Mary'];
  $scope.addName = function () {
    $scope.names.push($scope.newName);
  };
});
```

Nice! The `newName` property was created implicitly by the input field bound to the model property `newName`.
Since we are using built-in click handler `ng-click`, we did not have to call `$scope.$apply()` - it is done
automatically for us.

## Clear the entered value: step-3

We notice that the added name is NOT cleared from the input field. We never set the scope
property to the `undefined` or an empty string, thus it just stayed in the DOM. While it would be simple
to write the following code, we want to experiment first

```js
$scope.addName = function () {
  $scope.names.push($scope.newName);
  delete $scope.newName;
};
```

Can we *add* the missing delete line to the scope method dynamically?
Yes we can, right from the browser's console

```js
var scope = angular.element(document.body).scope();
var _addName = scope.addName; // save reference to the true method
scope.addName = function () { _addName(); delete scope.newName; };
```

BOOM! We dynamically extended an Angular application! This is a very useful approach:
accessing methods from the `$scope` to wrap them on the fly. For example, we can monitor
the method's execution. From the Chrome console:

    monitor(scope.addName);
    // Click "Add" button
    // VM946:1 function scope.addName called

We can even find where the code is without knowing it. Let us say, we want to stop when the 
button is clicked and we get into the `addName` method

    debug(angular.element(document.body).scope().addName)
    // Click "Add" button
    // Debugger pauses at the first line in `addName`

We can even profile long-running methods using Chrome's DevTools by "wrapping" the method
in `console.profile()` and `console.profileEnd()` commands. 
See [Improving Angular web app performance example][code-snippets-post] for details.

[code-snippets-post]: http://glebbahmutov.com/blog/improving-angular-web-app-performance-example/

## Calling the server to get the new name: step-4

Let us show how we can bend JavaScript closure rules a little. We can get a reference to the 
`$scope` object and the $scope.addName`, thus we can override the method completely at run-time

```js
var scope = angular.element(document.body).scope();
scope.addName = function () { alert('Not adding ' + scope.newName); };
```

This is a complete replacement. What if we wanted to do something else - like partial replacement?
Here is a good example. Let us say, `$scope.addName` grabbed the name not from the input field, but
from a server.

```html
<button ng-click="addName()">Add</button> from the server
```

```js
.controller('HelloController', function ($scope, $http) {
  $scope.names = ['John', 'Mary'];
  $scope.addName = function () {
    $http.get('/new/name').then(function (newName) {
      $scope.names.push(newName);
    });
  };
});
```

Well, we are running straight from the file system using `open index.html`. When we click "Add"
button we get an Ajax error

    Error: Failed to execute 'send' on 'XMLHttpRequest': Failed to load 'file:///new/name'

Duh!

## Bending the rules to mock the server response: step-5

Let us bend the JavaScript closure rules to mock the server. Here is how we are going to 
overwrite the `addName` method at runtime from the browser's console *to fake* the `$http` service.

```js
var $http = { 
    get: function (url) { 
        return new Promise(function (resolve) { 
            return resolve('Mock name'); 
        });
    } 
};
var $scope = angular.element(document.body).scope();
var _addName = $scope.addName;
$scope.addName = eval('(' + _addName.toString() + ')');
```

Click the "Add" button.

BOOM! The mock promise-returning function from the browser's console 
*overwrote a variable inside the parent's closure of a $scope method*. 
We knew that `addName` is using `$http` and `$scope` variables. Thus we replaced
the function by evaluating the `$scope.addName` method *as is*, but with *our defined*
variables; `$scope` was the same, but `$http` was a fake one. The JavaScript `eval`
takes the *current* scope as the parent scope, thus we can substitute new functionality
into the existing application dynamically.

Really useful library based on this principle is [ng-wedge][ng-wedge]:
real time mock responses for a live application.

[ng-wedge]: https://github.com/bahmutov/ng-wedge
