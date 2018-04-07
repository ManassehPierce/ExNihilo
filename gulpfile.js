var gulp    =    require('gulp');
var babel   =    require('gulp-babel');
var concat  =    require('gulp-concat');

gulp.task('default', function() {
	gulp.src(['src/custom.js', 'src/event.js', 'src/main.js', 'src/barrel.js', 'src/blocks.js'])
		.pipe(concat('ExNihiloPE.js'))
		.pipe(babel({presets:['es2015']}))
		.pipe(gulp.dest('dist'));
});