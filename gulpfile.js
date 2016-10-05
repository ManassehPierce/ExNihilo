var gulp    =    require('gulp');
var babel   =    require('gulp-babel');
var concat  =    require('gulp-concat');

gulp.task('default', ['concat', 'babel']);

gulp.task('concat', function() {
	gulp.src(['./src/event.js', './src/blockentity.js', './src/main.js', './src/barrel.js'])
		.pipe(concat('ExNihiloPE.js'))
		.pipe(gulp.dest('./tmp/'));
});

gulp.task('babel', function() {
	gulp.src('./tmp/*.js')
		.pipe(babel())
		.pipe(gulp.dest('./dist/'));
});