const { src, dest, watch, series, parallel } = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const terser = require('gulp-terser')
const sass = require('gulp-sass')

const dist = {
  css: 'dist/css/',
  js: 'dist/js/',
}

function css() {
  return src('scss/imagecompare.scss', { sourcemaps: true })
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(dest(dist.css, { sourcemaps: '.' }))
}

function cssMin() {
  return src(`${dist.css}imagecompare.css`)
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(dist.css))
}

function js() {
  return src('js/imagecompare.js')
    .pipe(dest(dist.js))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(dist.js))
}

function watchChanges() {
  watch('scss/imagecompare.scss', series(css, cssMin))
  watch('js/imagecompare.js', js)
}

exports.watch = watchChanges
exports.build = series(css, cssMin, js)
exports.default = series(css, cssMin, js, watchChanges)
