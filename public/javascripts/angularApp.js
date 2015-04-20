var app = angular.module('flapperNews', ['ui.router'])

.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home', 
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve: {
					postPromise: ['posts', function(posts) {
						return posts.getAll();
					}]
				}
			})

			.state('posts', {
				url: '/posts/{id}',
				templateUrl: '/posts.html',
				controller: 'PostsCtrl'
			});



		$urlRouterProvider.otherwise('home');
	}
])

.factory('posts', ['$http', function($http) {
	var obj = {
		posts: []
	};
	obj.getAll = function() {
		return $http.get('/posts')
		.success(function(data) {
			angular.copy(data, obj.posts);
		})
	};
	return obj;
}])

.controller('MainCtrl', [
	'$scope',
	'posts',
	function($scope, posts){
		$scope.test = 'Hello World';
		$scope.posts = posts.posts;

		$scope.addPost = function() {
			if ($scope.title == '') { return; }
			$scope.posts.push ({
				title: $scope.title, 
				upvotes: 0,
				link: $scope.link,
				comments: [
					{author: 'Joe', body: 'Coool Post', upvotes: 0},
					{author: 'Bob', body: 'Great Idea but everything is wrong', upvotes: 0}
				]
			});
			console.log($scope.link)
			$scope.title = '';
			$scope.link = '';
		}

		$scope.incrementUpvotes = function(post) {
			post.upvotes += 1;
		}
	}])

.controller('PostsCtrl', [
		'$scope',
		'$stateParams',
		'posts',
		function($scope, $stateParams, posts){
			$scope.post = posts.posts[$stateParams.id];

			$scope.addComment = function() {
			if ($scope.body == '') { return; }
			$scope.post.comments.push ({
				body: $scope.body, 
				upvotes: 0,
				author: 'user'
			});
			console.log($scope.link)
			$scope.body = '';
		}
		}
]);


