var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var less         = require('gulp-less');
var jshint       = require('gulp-jshint');

gulp.task('less', function() {
	gulp.src('less/main.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer('Firefox > 20', 'last 5 versions', 'Opera 12.1'))
		.pipe(gulp.dest('css'));
});

gulp.task('jshint', function() {
	gulp.src(['js/**/*.js', '!js/**/html5shiv.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
	gulp.watch('less/**/*.less', ['less']);
	gulp.watch('js/**/*.js', ['jshint']);
});

gulp.task('default', ['less', 'jshint', 'watch']);