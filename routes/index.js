var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Movie = require('../models/movie');
var underscore = require('underscore');

mongoose.connect('mongodb://localhost/videosWeb');

/* GET home page. */
router.get('/', function(req, res, next) {
	Movie.fetch(function(error, movies) {
		if (error) console.log(error);

		res.render('index', { 
			title: '首页' ,
			active: 'index',
			movies: movies
		});
	});
});

router.get('/movie/:id', function(req, res, next) {
	var id = req.params.id;

	Movie.findById(id, function(error, movie) {
		res.render('detail', { 
			title: '影片详情 - ' + movie.title,
			active: '',
			movie: movie
		});
	});
});

router.get('/admin/list', function(req, res, next) {
	Movie.fetch(function(error, movies) {
		if (error) console.log(error);

		res.render('list', { 
			title: '影片列表', 
			active: 'list',
			movies: movies
		});
	});
});

router.get('/admin/movie', function(req, res, next) {
	var movie = {
		id: '',
		title: '',
		doctor: '',
		country: '',
		language: '',
		year: '',
		poster: '',
		flash: '',
		summary: ''
	};

	res.render('admin', { 
		title: '添加影片', 
		active: 'movie',
		movie: movie 
	});
});

router.get('/admin/update/:id', function(req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function(error, movie) {
			if (error) console.log(error);

			res.render('admin', {
				title: '更新影片' + movie.title,
				active: 'movie',
				movie: movie
			});
		});
	}
});

router.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	
	if (id !== 'undefined') {
		Movie.findById(id, function(error, movie) {
			if (error) console.log(error);

			_movie = underscore.extend(movie, movieObj);
			
			_movie.save(function(error, movie) {
				if (error) console.log(error);

				res.redirect('/movie/' + movie._id);
			});
		});
	} else {
		_movie = new Movie({
			title: movieObj.title,
			doctor: movieObj.doctor,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});
		
		_movie.save(function(error, movie) {
			if (error) console.log(error);

			res.redirect('/movie/' + movie._id);
		});
	}
});

router.delete('/admin/list', function(req, res) {
	var id = req.body.id;

	if (id) {
		Movie.remove({_id: id}, function(error, movie) {
			if (error) {
				console.log(error);
			} else {
				res.json({
					status: 0,
					message: '删除成功'
				});
			}
		});
	} else {
		res.json({
			status: 1,
			message: '无效的 id 值'
		});
	}
});

module.exports = router;
