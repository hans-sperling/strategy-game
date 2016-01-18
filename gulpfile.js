// ---------------------------------------------------------------------------------------------------------------- Info

/**
 * @desc  Project build file.
 */


// ------------------------------------------------------------------------------------------------------------ Includes

var gulp  = require('gulp'),
    sass  = require('gulp-sass');

// -------------------------------------------------------------------------------------------------------------- Config

var path = {
    sass :  {
        input  : './scss/',
        output : './css/'
    }
};


// --------------------------------------------------------------------------------------------------------------- Tasks
// ------------------------------------------------------------------------------------------------------ SASS

gulp.task('sass', function () {
    return gulp.src(path.sass.input + '/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(path.sass.output));
});

// ------------------------------------------------------------------------------------------- Default / Watch

gulp.task('watch', function() {
    gulp.run('default');
    gulp.watch(path.sass.input + '/**/*.scss', function() {
        gulp.run('sass');
    });
});


gulp.task('default', function() {
    gulp.run('sass');
});


// ----------------------------------------------------------------------------------------------------------------- EOF