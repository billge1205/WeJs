# 1. hello word
// main.js
```
define(function (module) {
    module.exports.version = '1.0.0';
    module.exports.sayHello = function(){
        alert('helloworld');
    }
});
```
// main.html
```
<script type="text/javascript" src="http://www.billge.cc/node/js/WeJs.js" data-path="/node/js/" data-main="index"></script>
```

// index.js
```
var main = require('main');
main.sayHello();
```

> data-main 为总执行入口，也可以没有，直接写在main.html里。效果是一样的。

#2. API

###### init
> 初始化方法，参数说明如下：

>|参数|说明|默认|示例|
|:-----  |:-------|:-----|-----     |
|path    |根路径    |/   |/node/js/     |
|hashs    |hash映射表    |{}   |{demo1: '34eb57', demo2: 'a60c93'}|
|alias    |别名    |{}   |{jquery: '//cdn.qq.com/js/jquery.3d4a22.js'}|

>调用示例

```
WeJs.init({
    path: '/node/js/',
    hashs: {demo1: '34eb57', demo2: 'a60c93'},
    alias: {jquery: '//cdn.qq.com/js/jquery.3d4a22.js'}
});
```

>或者在调用WeJs时传入参数

```
<script type="text/javascript">
    var hash = {demo1: '34eb57', demo2: 'a60c93'};
    var alias = {jquery: '//cdn.qq.com/js/jquery.3d4a22.js'}
</script>
<script type="text/javascript" src="WeJs.js" data-path="/node/js/" data-hashs="$hash" data-alias="$alias"></script>
```

>WeJs会自动根据$hash/$alias变量名去查找，初始化

###### require
> 同步加载js对象，对象内容会同步返回，参数为文件名

> 示例：

```
WeJs.init({
    path: '/node/js/',
    hashs: {demo1: '34eb57', demo2: 'a60c93'},
    alias: {jquery: '//cdn.qq.com/js/jquery.3d4a22.js'}
});
var demo1 = require('demo1'); // /node/js/demo1.34eb57.js
var test = require('../test');  //  /node/test.js
var jquery = require('jquery');  //  //cdn.qq.com/js/jquery.3d4a22.js
```

> 注意：如果该模块为首次加载时，不可使用跨域模块。跨域模块可使用requires异步加载或者先预加载（preload）


###### requires
> 异步加载模块，第一个参数为加载项，第二个参数为回调函数

> 示例：

```
requires('jquery', function($){
    $.dosomething();
});

requires(['demo1', 'demo2'], function(d1, d2){
    d1.dosomething();
    d2.dosomething();
});
```


###### import
> 从模块中加载指定项

> 示例：

// demo1.js
```
define(function (module) {
    module.exports.version = '1.0.0';
    module.exports.say = function(content){
        console.log('I said ' + content);
    }
});
```

// index.js
```
var say = import('say').from('demo1');
say('hello');   // I said hello

var demo1 = import('*').from('demo1'); // 等同于 var demo1 = require('demo1');
```

###### define
> 模块定义类，写在模块中，当处于打包模式下，每个模块有且只能有一个define类

> 示例

// person.js
```
define(function (module) {
    var Person = function (name, age) {
        this.name = name;
        this.age = age;
    };
    Person.prototype.getInfo = function () {
        return {name: this.name, age: this.age, type: "person"};
    };
    module.exports = Person;
});
```

// index.js
```
var Person = require('person');
var p = new Person('p', 20);
console.log(p.getInfo());   // {name: 'p', age: 20, type: "person"}
```

###### extend
> 继承模式，使模块具有类的继承方法

> 示例

// child.js
```
extend('person').define(function (module) {
    this.prototype.getInfo = function (){
        return {name: this.name, age: this.age, type: 'child'};
    };
    module.exports = this;
});
```
// index.js
```
var Child = require('child');
var c = new Child('c', 12);
console.log(c.getInfo());   // {name: 'c', age: 12, type: "child"}
```


#3. 嵌套依赖

###### 同步模式
> 模块文件中可以直接使用require方法进行同步加载

> 示例

// demo1.js
```
define(function (module) {
    module.exports.add = function(a, b){return a+b};
});
```

// demo2.js
```
define(function (module) {
    module.exports.x = 0;
    var demo = require('demo1');
    module.exports.x = demo.add(3, 4);
});
```

// index.js
```
var demo = require('demo2');
console.log(demo.x);   // 7

requires('demo2', function(demo)(){
    console.log(demo.x);  // 7
});
```


###### 异步模式
> 在模块中可以调用异步加载方式，需要注意的是，在使用requires异步加载方法时会等待异步加载完成后回调。
> 但同步require方法时，如果该模块是首次加载，则只会返回异步加载之前的结果值，如需使用同步方式，请先预加载（preload）

> 示例

// demo1.js
```
define(function (module) {
    module.exports.add = function(a, b){return a+b};
});
```

// demo2.js
```
define(function (module) {
    module.exports.x = 0;
    module.requires('demo1', function(demo){
        module.exports.x = demo.add(3, 4);
    });
});
```
// index.js
```
var demo = require('demo2');
console.log(demo.x);   // 0 未加载

requires('demo2', function(demo)(){
    console.log(demo.x);  // 7 已加载
});

// 所有现有依赖都完成后会自动调用
WeJs.ready(function(){
    var demo = require('demo2');
    console.log(demo.x);   // 7 已加载
});
```

###### 循环嵌套
> 假设这边有一个循环的嵌套，程序也不会异常，遵循CMD的加载模式，会按照循序执行

> 示例

// test1.js
```
define(function (module) {
    console.log('test1 start');
    module.exports.done = false;

    var test2 = require('test2');
    console.log('in test1, test2.done:'+test2.done);

    module.exports.done = true;
    console.log('test1 end');
});
```

// test2.js
```
define(function (module) {
    console.log('test2 start');
    module.exports.done = false;

    var test1 = require('test1');
    console.log('in test2, test1.done:'+test1.done);

    module.exports.done = true;
    console.log('test2 end');
});
```

// index.js
```
var test1 = require('test1');
var test2 = require('test2');
console.log('test1.done:'+test1.done, 'test2.done:'+test2.done);
```

// 执行结果如下：
```
test1 start
test2 start
in test2, test1.done:false
test2 end
in test1, test2.done:true
test1 end
test1.done:true test2.done:true
```

#4. 预加载（preload）
> 和hash/alias 一样，预加载在调用WeJs库时定义，可以为数组变量，或者以都逗号隔开的字符串

> 示例

// main.html
```
<script>var preload = ['demo1', 'demo2'];</script>
<script type="text/javascript" src="WeJs.js" data-main="index" data-preload="$preload"></script>

等同于

<script type="text/javascript" src="WeJs.js" data-main="index" data-preload="demo1,demo2"></script>
```

// index.js
```
var demo1 = require('demo1');  // 直接加载预加载的数据
```

或者也可以这么写
```
WeJs.ready(function(demo1, demo2){
    // demo1 demo2 为预加载的模块
});
```

> 页面必然要用到的库，建议使用预加载，这样在同步require时，效率会非常的快。而且也使得require方法支持跨域引用
