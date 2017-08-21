const exec = require('child_process').exec;
const gulp = require('gulp');
const concat = require('gulp-concat');
const inlineTemplates = require('gulp-inline-ng2-template');
const util = require('gulp-util');
const sass = require('node-sass');
const through = require('through2');

/**
 * Inline templates configuration.
 * @see  https://github.com/ludohenin/gulp-inline-ng2-template
 */
const INLINE_TEMPLATES = {
  SRC: './src/lib/**/*.ts',
  DIST: './.tmp/src-inlined',
  CONFIG: {
    base: '/src',
    target: 'es6',
    useRelativePaths: true,
    styleProcessor: compileSass
  }
};

/**
 * Inline external HTML and SCSS templates into Angular component files.
 * @see: https://github.com/ludohenin/gulp-inline-ng2-template
 */
gulp.task('inline-templates', () => {
  return gulp.src(INLINE_TEMPLATES.SRC)
    .pipe(inlineTemplates(INLINE_TEMPLATES.CONFIG))
    .pipe(gulp.dest(INLINE_TEMPLATES.DIST));
});

/**
 * Build ESM by running npm task.
 * This is a temporary solution until ngc supports --watch mode.
 * @see: https://github.com/angular/angular/issues/12867
 */
gulp.task('build:esm', ['inline-templates'], (callback) => {
  exec('npm run ngcompile', function (error, stdout, stderr) {
    console.log(stdout, stderr);
    callback(error)
  });
});

/**
 * Implements ESM build watch mode.
 * This is a temporary solution until ngc supports --watch mode.
 * @see: https://github.com/angular/angular/issues/12867
 */
gulp.task('build:esm:watch', ['build:esm'], () => {
  gulp.watch('src/**/*', ['build:esm']);
});

/**
 * Cleans up and copies the package.json file to the .package directory.
 */
gulp.task('copy:package', () => {
  let p = require('./package.json');
  p.scripts = undefined;
  p.devDependencies = undefined;
  p.private = undefined;
  return packageSource(p)
    .pipe(gulp.dest('.package'));
});

gulp.task('copy:assets', () => {
  return gulp.src(['src/assets/**/*', '!**/*.dev.*'])
    .pipe(gulp.dest('./.package/assets/'));
});

gulp.task('copy:sass', () => {
  return gulp.src(['src/styles/**/*.scss'])
    .pipe(gulp.dest('.package/scss'));
});

/**
 * Compile SASS to CSS.
 * @see https://github.com/ludohenin/gulp-inline-ng2-template
 * @see https://github.com/sass/node-sass
 */
function compileSass(path, ext, file, callback) {
  let compiledCss = sass.renderSync({
    data: file,
    outputStyle: 'compressed',
  });
  callback(null, compiledCss.css);
}

/**
 * Creates a JSON file stream of the input object.
 */
function packageSource(obj) {
  let src = require('stream').Readable({
    objectMode: true
  });
  src._read = function () {
    this.push(new util.File({
      cwd: '',
      base: '',
      path: 'package.json',
      contents: new Buffer(JSON.stringify(obj, null, '    '))
    }));
    this.push(null);
  }
  return src;
}

function parse() {
  return through.obj(function (file, enc, callback) {
    let html = file.contents.toString();
    let header = html.substr(html.indexOf('<header>'));
    header = header.substr(0, header.indexOf('</h1>') + 5) + '</header>';
    header = header.replace('<h1>', '<h3 class="p-t">')
      .replace('</h1>', '</h3>');

    let content = html.substr(html.indexOf('<div class="glyph">'));
    content = content.substr(0, content.indexOf('<footer>'));

    this.push(new util.File({
      base: file.base,
      path: file.path,
      contents: new Buffer(header + content)
    }));

    callback();
  });
};
