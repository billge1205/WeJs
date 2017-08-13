# 1. hello word
###### // main.js
```
define(function (module) {
	module.exports.version = '1.0.0';
	module.exports.sayHello = function(){
		alert('helloworld');
	}
});
```
###### // main.html
```
<script type="text/javascript" src="http://www.billge.cc/node/js/WeJs.js" path="/node/js/"></script>
<script type="text/javascript">
	var main = require('main');
	main.sayHello();
</script>
```

#2. API
**init**
> //todo

**require**
> //todo

**requires**
> //todo

**import**
> //todo

**define**
> //todo

**extend**
> //todo


#3. 嵌套依赖
> //todo


#4. 预加载
> //todo

#5. 别名/hash
> //todo