var gulp    =    require('gulp');
var babel   =    require('gulp-babel');
var concat  =    require('gulp-concat');

gulp.task('default', function() {
	gulp.src(['polyfill/map.js', 'src/custom.js', 'src/event.js', 'src/main.js', 'src/barrel.js', 'src/blocks.js'])
		.pipe(concat('ExNihiloPE.js'))
		.pipe(babel({presets:['env']}))
		.pipe(gulp.dest('dist'));
});

gulp.task('concat', function() {
	return gulp.src(['./src/custom.js', 'src/event.js', './src/main.js', './src/barrel.js', 'blocks.js'])
		.pipe(concat('ExNihiloPE.js'))
		.pipe(gulp.dest('./tmp/'));
});

gulp.task('babel', function() {
	return gulp.src('./tmp/*.js')
		.pipe(babel({presets:['env']}))
		.pipe(gulp.dest('./dist/'));
});