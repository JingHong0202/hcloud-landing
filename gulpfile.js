const gulp = require('gulp'),
  cleancss = require('gulp-clean-css'), //css压缩组件
  uglify = require('gulp-uglify'), //js压缩组件
  htmlmin = require('gulp-htmlmin'), //html压缩组件
  htmlclean = require('gulp-htmlclean'), //html清理组件
  imagemin = require('gulp-imagemin'), //图片压缩组件
  del = require('del'),
  fontSpider = require('gulp-font-spider')

gulp.task('clean', () => {
  return del(['dist/**/*'])
})

gulp.task('compressJs', () => {
  return gulp.src(['./static/**/*.js']).pipe(uglify()).pipe(gulp.dest('./dist/static'))
})

gulp.task('compressCss', () => {
  var option = {
    rebase: false,
    advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
    compatibility: '*', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
    keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
    keepSpecialComments: '*' //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
  }
  return gulp.src(['./static/**/*.css']).pipe(cleancss(option)).pipe(gulp.dest('./dist/static'))
})

gulp.task('compressHtml', () => {
  var cleanOptions = {
    protect: /<\!--%fooTemplate\b.*?%-->/g, //忽略处理
    unprotect: /<script [^>]*\btype="text\/x-handlebars-template"[\s\S]+?<\/script>/gi //特殊处理
  }
  var minOption = {
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    removeComments: true, //清除HTML注释
    minifyJS: true, //压缩页面JS
    minifyCSS: true, //压缩页面CSS
    minifyURLs: true //替换页面URL
  }
  return gulp
    .src('./index.html')
    .pipe(htmlclean(cleanOptions))
    .pipe(htmlmin(minOption))
    .pipe(gulp.dest('./dist'))
})

gulp.task('compressMedia', () => {
  var option = {
    optimizationLevel: 7, //类型：Number 默认：3 取值范围：0-7（优化等级）
    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
    multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
  }
  return gulp.src(['./static/**/*']).pipe(imagemin(option)).pipe(gulp.dest('./dist/static'))
})

gulp.task('fontspider', function () {
  return gulp.src(['./index.html']).pipe(fontSpider({ backup: false }))
})

gulp.task(
  'build',
  gulp.series('clean', 'compressHtml', 'compressCss', 'compressJs', 'compressMedia', 'fontspider')
)
