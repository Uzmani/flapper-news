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
				controller: 'PostsCtrl',
				resolve: {
					post: ['$stateParams', 'posts', function($stateParams, posts) {
					  return posts.get($stateParams.id);
					}]
				}
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
		});
	};

	obj.create = function(post) {
		return $http.post('/posts', post).success(function(data) {
			obj.posts.push(data);
		});
	}

	obj.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote').success(function(data) {
			post.upvotes += 1;
		});
	} 
	obj.get = function(id) {
		return $http.get('/posts/' + id).then(function(res){
    		return res.data;
  		});
	}
	obj.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	}
	obj.upvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote').success(function(data){
      		comment.upvotes += 1;
    	});
	}

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
			posts.create ({
				title: $scope.title, 
			});
			console.log($scope.link)
			$scope.title = '';
			$scope.link = '';
		}

		$scope.incrementUpvotes = function(post) {
			posts.upvote(post);
		}
	}])

.controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	'post',
	function($scope, $stateParams, posts, post){
		$scope.post = post;

		$scope.addComment = function() {
			if($scope.body === '') { return; }
			posts.addComment(post._id, {
			body: $scope.body,
			author: 'user'
			}).success(function(comment) {
			$scope.post.comments.push(comment);
			});
			$scope.body = '';
		};
		$scope.incrementUpvotes = function(comment){
				posts.upvoteComment(post, comment);
		};
	}
]);


