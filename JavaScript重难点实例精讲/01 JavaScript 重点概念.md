### 1. 基本数据类型

JavaScript 中，数据类型分为基本数据类型和引用数据类型：

```javascript
// 基本数据类型
Undefined		Null		boolean		Number		String		Symbol (ES6 新增)		BigInt（ES2020 新增）
```

#### 1.1 Undefined

该类型只有一个字面值 `undefined`，表示一个变量不存在。

产生  `undefined` 的 4 种常见场景：

1.   声明但未初始化的变量返回 `undefined`

     ```javascript
     var a
     console.log(a) // undefined
     ```

2.   获取一个对象某个不存在的属性（自身属性和原型链继承属性）时，会返回 `undefined`

     ```javascript
     var car = {
         name: 'benz'
     }
     console.log(car.price) // undefined
     ```

3.   函数没有明确的返回值，但在其他地方使用了返回值，会默认返回 `undefined`

     ```javascript
     function foo() {}
     console.log(foo()) // undefined
     ```

4.   函数定义时使用了多个形参，但在调用时传递的参数数量少于形参数量，未匹配上的参数为 `undefined`

     ```javascript
     function foo(p1, p2, p3) {
         console.log(p3)	// undefined
     }
     foo(1, 2)
     ```

#### 1.2 Null

该类型只有一个字面值 `uull`，表示一个空指针对象，因此使用 `typeof` 操作符检测时返回 `object`。

产生  `null` 的 3 种常见场景：

1.   声明变量但暂时不知道保存什么值的时候，一般先赋值为 `null`

     ```javascript
     var unknown = null
     function foo() {
         return true
     }
     unknown = foo()
     ```

2.   获取 DOM 元素时，如果没有获取到指定的元素对象，返回 `null`

3.   使用正则表达式进行捕获时，如果没有捕获结果，返回 `null`

>   Undefined 和 Null 的异同：
>
>   1.   相同点
>
>        -   两者都只有一个字面量
>
>        -   转换为布尔类型时，都为 `false`（造成的问题：通过非运算符获取结果为 `true` 的变量，无法判断是 `undefined` 还是 `null`）
>
>        -   将两者转换为对象（或引用属性）时，都会抛出一个 `TypeError` 异常
>
>            ```javascript
>            var a
>            var b = null
>            console.log(a.name)	// Cannot read property 'name' of undefined
>            console.log(b.name)	// Cannot read property 'name' of null
>            ```
>
>        -   Undefined 派生自 Null，`==`（非严格相等）判定两者相等
>
>   2.   不同点
>
>        -   `null` 是关键字，`undefined` 是一个全局变量（即挂载在 `window` 对象上的变量），不是关键字
>
>        -   使用 `typeof` 时，`undefined` 返回 `undefined`，`null` 返回 `object`
>
>        -   通过 `call` 调用 `toString()` 时，`undefined` 返回 `[object Undefined]`，`null` 返回 `[object Null]`
>
>            ``` javascript
>            Object.prototype.toString.call(undefined) // [object Undefined]
>            Object.prototype.toString.call(null)	  // [object Null]
>            ```
>
>        -   转换为数值类型时，`undefined` 转换为 `NaN`，无法参与计算；`null` 转换为 0，可以参与计算
>
>   无论什么时候，都不必要显式定义变量为 `undefined`，应该初始化为 `null`。

#### 1.3 Boolean

该类型只有两个字面值 `true` 和 `false`

布尔类型常用于 `if` 语句判断中，`if` 语句可以接收任何类型的表达式，但都会隐式转换为 Boolean 类型，转换规则如下：

-   String --> Boolean 
    -   空字符串转换为 `false`
    -   其他都转换为 `true`，即使是 `" "` 和 `'false'`
-   Number --> Boolean 
    -   0 和 `NaN` 转换为 `false`
    -   其他均转换为 `true`，包括 `Infinity` 和 `-Infinity`
-   Object --> Boolean 
    -   `null` 转换为 `false`
    -   其他都转换为 `true`，包括空对象 `{}`
-   Function --> Boolean 
    -   都转换为 `true`
-   Null --> Boolean
    -   `null` 转换为 `false`
-   Undefined --> Boolean
    -   `undefined` 转换为 `false`

#### 1.4 Number

该类型包括整型和浮点型

整型：

-   十进制

-   八进制，首位以 `0` 表示，如 `024` 等于 十进制的 `20`，如果后面的某一位超出了八进制字面值，破坏了八进制的规则，则按十进制表示，如 `018` 为十进制的 `18`

-   十六进制，首位以 `0x` 表示，如果后面的某一位超出了十六进制字面值，破坏了十六进制的规则，则抛出异常

    ```javascript
    var num = 0x2g	// SyntaxError: Invalid or unexpected token
    ```

>   ES6 之后，引入了 `0b` 或 `0B` 开头的二进制表示，并且引入了八进制的新表示方式，即 `0o` 或 `0O` 开头；不再推荐 `0` 开头的八进制字面量表示法，而且其在严格模式下是无效的，会导致报错。

##### 1.4.1 Number 类型隐式转换

-   Boolean --> Number
    -   `true` --> `1`
    -   `false` --> `0`
-   Null --> Number
    -   `null` --> `0`
-   Undefined --> Number
    -   `undefined` --> `NaN`
-   String --> Number
    -   如果字符串只包括数字，则转换为十进制数；如果前面有 `0`，则直接省略，如 `"0123"` 转换为 `123`
    -   如果字符串包含的是有效的浮点数，则转换为对应的浮点数
    -   如果字符串中包含有效的十六进制数，则转换为对应的十进制，如 `0x3f` 转换为 `64`
    -   如果为空字符串或全为空格，转换为 `0`
    -   如果字符串为上述以外的格式，转换为 `NaN`
-   Object --> Number
    -   优先调用 `valueOf()` 函数，然后通过该函数返回值按照上述规则转换；如果转换类型为 `NaN`，则调用 `toString()` 函数，通过该函数返回值按照上述规则转换，如果有确定的 Number 类型返回值则结束，否则返回 `NaN`

##### 1.4.2 Number 类型显式转换

有三个函数：`Number()`、`parseInt()` 和 `parseFloat()`

1.   `Number()` 

     函数转换规则

     -   如果是数字，按照对应的进制数据转换，统一转换为十进制返回

         ```javascript
         Number(10)	 // 10
         Number(010)	 // 8
         Number(0x10) // 16
         ```

     -   如果是布尔型，`false` 转换为 `0`，`true` 转换为 `1`

     -   如果是 `null`，转换为 `0`

     -   如果是 `undefined`，转换为 `NaN`

     -   如果是字符串，则：

         -   如果只包含数字，则转换为十进制数；如果前面有 `0`，则直接省略（这意味着不会转换八进制数）

         -   如果字符串包含的是有效的浮点数，则转换为对应的浮点数，前置的多个重复的 `0` 会被清空，只保留一个

             ```javascript
             Number('000.12') // 0.12
             ```

         -   如果字符串包含有效的十六进制数，则转换为对应的十进制，如 `0x3f` 转换为 `64`

         -   如果为空字符串或全为空格，转换为 `0`

         -   如果字符串为上述以外的格式，转换为 `NaN`

     -   如果是对象，优先调用 `valueOf()` 函数，然后通过该函数返回值按照上述规则转换；如果转换类型为 `NaN`，则调用 `toString()` 函数，通过该函数返回值按照上述规则转换，如果有确定的 Number 类型返回值则结束，否则返回 `NaN`

         ```javascript
         // 通过 valueOf() 函数转换
         var obj = {
             age: 21,
             valueOf: function () {
                 return this.age
             },
             toString: function () {
                 return 'good'
             }
         }
         
         Number(obj) // 21
         
         // 通过 toString() 函数转换
         var obj = {
             age: '21',
             valueOf: function () {
                 return []
             },
             toString: function () {
                 return this.age
             }
         }
         
         Number(obj)	// 21
         
         // 两者均无法转换
         var obj = {
             age: 21,
             valueOf: function () {
                 return 'a'
             },
             toString: function () {
                 return 'b'
             }
         }
         
         Number(obj)	// NaN
         
         // 如果两者返回的都是对象类型而无法转换为基本数据类型，则抛出异常
         var obj = {
             age: 21,
             valueOf: function () {
                 return []
             },
             toString: function () {
                 return []
             }
         }
         
         Number(obj)	// TypeError: Cannot convert object to primitive value
         ```

     >   Number 类型隐式转换相当于调用了 `Number()` 函数。

2.   `parseInt()` 函数

     功能：用于解析一个字符串，并返回指定的基数对应的整数值

     语法：

     ```javascript
     parseInt(string, radix)	
     // 第一个参数为要解析的值，如果不是字符串，则使用 toString() 转换为字符串，前面的空白符被忽略
     // 第二个参数为基数，范围为 2~36，默认为 10，任何情况下都建议补充这个值
     ```

     注意点：

     -   非字符串转换为字符串

         **传入的第一个参数为非字符串时，都优先转换为字符串，即使传入的是整型**

         ```javascript
         parseInt('0x12', 16) // 18	'0x12' --> 18
         parseInt(0x12, 16)	 // 24	0x12 --> '18' --> 24
         ```

     -   数据截取的前置匹配原则

         `parseInt()` 函数在做转换时，从字符串的第一个字符开始匹配，如果处于基数指定的范围，则保留并继续往后匹配满足条件的字符，直到某个字符不满足基数指定的数据范围，则从该字符开始，舍弃后面的全部字符。在获取到满足条件的字符后，将这些字符转换为整数。

         ```javascript
         parseInt('fg123', 16)	// 15
         parseInt('0x12', 16)	// 18
         parseInt('0x12', 10)	// 0
         parseInt(15 * 3, 10)	// 45	15 * 3 --> '45' --> 45
         // 字符串中的算术运算不会执行
         parseInt('15 * 3', 10)	// 15
         ```

     -   对包含字符 `e` 的不同数据的处理差异

         当传入的参数本身就是 Number 类型时，会将 `e` 按照科学计数法计算后转换成字符串，然后按照对应的基数转换得到最终的结果。如果传入的字符串中直接包含 `e`，那么并不会按照科学计数法处理，而是会判断字符 `e` 是否处在可处理的进制范围内，如果不在则直接忽略，如果在则转换成对应的进制数。

         ```javascript
         parseInt(6e3, 10)	// 6000
         parseInt(6e3, 16)	// 24576
         parseInt('6e3', 10)	// 6
         parseInt('6e3', 16)	// 1763
         ```

     -   对浮点型数的处理

         如果传入的值是浮点型数，则会忽略小数点及后面的数，直接取整。

     -    `map()` 函数与 `parseInt()` 函数的隐形坑

         ```javascript
         // 有一个数组 ['1', '2', '3', '4']，欲将数组中的元素全部转换为整数
         // 首先想到的可能就是在 Array 的 map() 函数中调用 parseInt() 函数
         var arr = ['1', '2', '3', '4']
         var result = arr.map(parseInt)
         console.log(result)	// [1, NaN, NaN, NaN]
         
         // 原因是 arr.map(parseInt) 与下面的代码等价
         arr.map(function (val, index) {
             return parseInt(val, index)
         })
         
         // 所以最终的代码等价如下
         parseInt('1', 0)	// 1	任何以 0 为基数都会返回本身
         parseInt('2', 1)	// NaN	基数范围为 2~36，不满足则返回 NaN
         parseInt('3', 2)	// NaN	超出进制表示范围，返回 NaN
         parseInt('4', 3)	// NaN 	超出进制表示范围，返回 NaN
         
         // 不可以直接将 parseInt 作为 map() 的参数，正确的转换方式如下
         var arr = ['1', '2', '3', '4']
         var result = arr.map(function (val) {
             return parseInt(val, 10)
         })
         console.log(result)	// [1, 2, 3, 4]
         ```

     下面的转换结果全为 `15`：

     ```javascript
     parseInt("0xF", 16)	
     parseInt("F", 16)		
     parseInt("17", 8)     
     parseInt(021, 8)     	// 021 --> '17' --> 15
     parseInt("015", 10)   
     parseInt(15.99, 10)   
     parseInt("15,123", 10) 
     parseInt("FXX123", 16) 
     parseInt("1111", 2)   
     parseInt("15 * 3", 10)
     parseInt("15e2", 10)
     parseInt("15px", 10)	// JavaScript 中非常常用的场景
     parseInt("12", 13)	 	// 13 + 2 = 15
     ```

3.   `parseFloat()` 函数

     功能：用于解析一个字符串，返回对应的浮点数。如果给定值不能转换为数值，则会返回 `NaN`，而且其没有进制的概念

     -   如果在解析过程中遇到了正负号 `+`、`-`、`0`～`9`、小数点或者科学计数法 `e`、`E` 以外的字符，则会忽略从该字符及其后面的所有字符，返回当前已经解析的字符的浮点数形式。其中，正负号必须出现在字符的第一位，而且不能连续出现。

         ```javascript
         parseFloat('+1.2')	// 1.2
         parseFloat('-1.2')	// -1.2
         parseFloat('++1.2')	// NaN
         parseFloat('--1.2')	// NaN
         parseFloat('1+1.2')	// 1
         ```

     -   字符串前面的空白符会直接忽略，如果第一个字符就无法解析，则会直接返回 `NaN`。

         ```javascript
         parseFloat('    1.2')	// 1.2
         parseFloat('f1.2')		// NaN
         ```

     -   对于字符串中出现的合法科学运算符 `e`，进行运算处理后会转换成浮点型数，这与 `parseInt()` 函数不同，后者直接放弃处理 `e`。

         ```javascript
         parseFloat('4e3')	// 4000
         parseInt('4e3', 10)	// 4
         ```

     -   对于小数点，只能正确匹配第一个，第二个小数点是无效的，它后面的字符也都将被忽略。

         ```javascript
         parseFloat('1.1.1')	// 1.1
         ```

     举例：

     ```javascript
     parseFloat('123AF')	// 123
     parseFloat('0xA')	// 0
     parseFloat('22.5')	// 22.5
     parseFloat('1.1.1')	// 1.1
     parseFloat('098.5')	// 98.5
     ```

4.   总结

     -   `Number()` 转换的是传入的整个值，而 `parseInt()` 和 `parseFloat()` 从首位开始匹配符合条件的值。如果整个值不能被完整转换，则会返回 `NaN`。
     -   `parseFloat()` 在解析小数点时，会将第一个小数点当作有效字符，而 `parseInt()` 函数在解析时如果遇到小数点会直接停止。
     -   `parseFloat()` 没有进制的概念，而 `parseInt()` 在解析时会依赖于传入的基数做数值转换。

##### 1.4.3 `isNaN()` 和 `Number.isNaN()` 对比

`NaN` (Not a Number) 是 Number 类型中特殊的存在，表示应该返回一个数值但没有返回。

`NaN` 存在的目的是保证在某些异常情况下保证程序的正常运行（脚本语言的特色之一），例如 `0 / 0` 在 JavaScript 中不会报错，而返回 `NaN`，程序接着运行。

>   热知识：只有 `0 / 0` 才返回 `NaN`，其他数值除以 `0` 都返回 Infinity。

`NaN` 的两个特点：

-   任何涉及 `NaN` 的操作都返回 `NaN`
-   `NaN` 和任何值都不想等，即使是 `NaN` 本身

`NaN` 产生的条件：

-   数值运算时，返回了一个无法表示的数值，如 `0 / 0` 就会返回 `NaN`
-   类型转换时，某些数据不能直接转换为数值类型，会返回 `NaN`，如 `1 - 'a'`

在判断 `NaN` 时，ES5 提供了 `isNaN()` ，ES6为 Number 类型增加了静态函数 `isNaN()`。

1.   `isNaN()` 函数

     功能：用来确定一个变量是不是 `NaN`（非数值类型先尝试转换为数值类型）

     ```javascript
     isNaN(NaN) 		   				// true
     isNaN(undeﬁned)  				// true
     isNaN({})        				// true
     isNaN(true)      				// false, Number(true) 会转换成数字 1
     isNaN(null)      				// false, Number(null) 会转换成数字 0
     isNaN(1)        				// false
     isNaN('')        				// false, Number('') 会转换为成数字 0
     isNaN("1")          			// false, 字符串 "1" 可以转换成数字 1
     isNaN("JavaScript")   			// true, 字符串 "JavaScript" 无法转换成数字
     // Date类型
     isNaN(new Date())     			// false, Date 类型转换为数值类型时, 会转换为对应的时间戳
     isNaN(new Date().toString())  	// true, Date 类型调用 toString() 时, 会返回表示时间的字符串，无法转换为数字
     ```

2.   `Number.isNaN()` 函数

     功能：真正意义上确定一个变量是不是 `NaN`（不会做数值转换）

     ```javascript
     Number.isNaN(NaN)        // true
     Number.isNaN(undeﬁned)   // false
     Number.isNaN(null)       // false
     Number.isNaN(true)       // false
     Number.isNaN('')         // false
     Number.isNaN(123)        // false
     ```

     只有传入 `NaN` 时才返回 `true`

     兼容性处理：

     ```javascript
     // 在非 ES6 中使用 isNaN()
     if (!Number.isNaN) {
         Number.isNaN = function (n) {
             return n !== n		// 只有 NaN 在和自身比较时返回 false
         }
     }
     ```

##### 1.4.4 浮点数运算

在 JavaScript 中，整数和浮点数都属于 Number 类型，统一采用 64 位浮点数进行存储。虽然存储数据的方式是一致的，但是在进行数值运算时，整数不存在精度问题，而**浮点数存在精度问题**。

浮点数的表示方式：最高位为符号位，接着的 11 位指数位，最后 52 位为小数为，即有效数字的部分。

因为浮点型数使用 64 位存储时，最多只能存储 52 位的小数位，对于一些存在无限循环的小数位浮点数，会截取前 52 位，从而丢失精度，导致出人意料的结果。

```javascript
0.1 + 0.2 == 0.3	// false
0.3 / 0.1 == 3		// false
```

如何计算 `0.1 + 0.2`：

```javascript
// 0.1
0.1 * 2 = 0.2	// 0
0.2 * 2 = 0.4	// 0
0.4 * 2 = 0.8	// 0
0.8 * 2 = 1.6	// 1
0.6 * 2 = 1.2	// 1
0.2 * 2 = 0.4	// 0 -- 这里开始无限循环
// 0.0 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 001(1), 第 53 位为 1, 进位一次
// 所以 0.1 的浮点数表示为 0.0 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 010

// 0.2
0.2 * 2 = 0.4	// 0
0.4 * 2 = 0.8	// 0
0.8 * 2 = 1.6	// 1
0.6 * 2 = 1.2	// 1
0.2 * 2 = 0.4	// 0 -- 这里开始无限循环
// 0. 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 (0), 第 53 位为 0, 不进位
// 所以 0.1 的浮点数表示为 0. 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011

	0.0001100110011001100110011001100110011001100110011010
+	0.0011001100110011001100110011001100110011001100110011
----------------------------------------------------------
	0.0100110011001100110011001100110011001100110011001101
// 转换为十进制为 0.30000000000000004
```

浮点数运算的一个解决方案：

将浮点数先乘以一定的数值转换为整数，通过整数进行运算，然后将结果除以相同的数值转换成浮点数后返回。

```javascript
const operationObj = {
   /* 处理传入的参数，不管传入的是数组还是以逗号分隔的参数都处理为数组 */
   getParam(args) {
      return Array.prototype.concat.apply([], args)
   },

   /**
    * 获取每个数的乘数因子，根据小数位数计算
    * 1.首先判断是否有小数点，如果没有，则返回 1；
    * 2.有小数点时，将小数位数的长度作为 Math.pow() 函数的参数进行计算
    * 例如 2 的乘数因子为 1，2.01 的乘数因子为 100
    */
   multiplier(x) {
      let parts = x.toString().split('.');
      return parts.length < 2 ? 1 : Math.pow(10, parts[1].length)
   },

   /**
    * 获取多个数据中最大的乘数因子
    * 例如 1.3 的乘数因子为 10，2.13 的乘数因子为 100
    * 则 1.3 和 2.13 的最大乘数因子为 100
    */
   correctionFactor() {
       let args = Array.prototype.slice.call(arguments)
       let argArr = this.getParam(args)
       return argArr.reduce((accum, next) => {
           let num = this.multiplier(next)
           return Math.max(accum, num)
       }, 1)
   },

   /**
    * 加法运算
    */
   add(...args) {
       let calArr = this.getParam(args)
       // 获取参与运算值的最大乘数因子
       let corrFactor = this.correctionFactor(calArr)
       let sum = calArr.reduce((accum, curr) => {
           // 将浮点数乘以最大乘数因子，转换为整数参与运算
           return accum + Math.round(curr * corrFactor)
       }, 0)
       // 除以最大乘数因子
       return sum / corrFactor
   },

   /**
    * 减法运算
    */
   subtract(...args) {
       let calArr = this.getParam(args)
       let corrFactor = this.correctionFactor(calArr)
       let diff = calArr.reduce((accum, curr, curIndex) => {
          // reduce() 函数在未传入初始值时，curIndex 从 1 开始，第一位参与运算的值需要
          // 乘以最大乘数因子
          if (curIndex === 1) {
              return Math.round(accum * corrFactor) - Math.round(curr * corrFactor)
          }
          // accum 作为上一次运算的结果，就无须再乘以最大因子
          return Math.round(accum) - Math.round(curr * corrFactor)
       })
     // 除以最大乘数因子
       return diff / corrFactor;
   },

   /**
    * 乘法运算
    */
   multiply(...args) {
      let calArr = this.getParam(args);
      let corrFactor = this.correctionFactor(calArr)
      calArr = calArr.map((item) => {
          // 乘以最大乘数因子
          return item * corrFactor
      })
      let multi = calArr.reduce((accum, curr) => {
          return Math.round(accum) * Math.round(curr)
      }, 1)
      // 除以最大乘数因子
      return multi / Math.pow(corrFactor, calArr.length)
   },

   /**
    * 除法运算
    */
   divide(...args) {
       let calArr = this.getParam(args);
       let quotient = calArr.reduce((accum, curr) => {
           let corrFactor = this.correctionFactor(accum, curr)
           // 同时转换为整数参与运算
           return Math.round(accum * corrFactor) / Math.round(curr * corrFactor)
       })
       return quotient;
   }
}
```

#### 1.5 String

将其他类型转换为 String 类型时，如果是引用类型的数据，则在转换时调用 `toString()` 函数，得到不同类型值的字符串表示；如果是基本数据类型，则会直接将字面值转换为字符串表示形式。例如， `null` 和 `undefined` 转换为字符串时，会直接返回字面值，分别是 `"null"` 和 `"undefined"`。

在将某个数据转换为字符串时，有一个简单的方法是直接使用加号 `+` 拼接一个空字符串 `""`：

```javascript
console.log(123 + '')		// '123'
console.log([1,2,3] + '')	// '1,2,3'
console.log(true + '')		// 'true'
```

##### 1.5.1 String 类型的定义和调用

在 JavaScript 中，有 3 种定义字符串的方式，分别是字符串字面量，直接调用 `String()` 函数与 `new String()` 构造函数。

1.   字符串字面量

     在 JavaScript 中，单引号和双引号是等价的。

     ```javascript
     "JavaScript"
     'JavaScript'
     ```

2.   调用 `String()`

     调用 `String()` 函数，会将传入的任何类型的值转换成字符串类型，转换规则如下：

     -   如果是 Number 类型的值，则直接转换成对应的字符串

     -   如果是 Boolean 类型的值，则直接转换成 `'true'` 或者 `'false'`

     -   如果值为 `null`，则返回字符串 `'null'`

     -   如果值为 `undefined`，则返回字符串 `'undefined'`

     -   如果值为字符串，则直接返回字符串本身

     -   如果值为引用类型，则会先调用 `toString()` 函数获取返回值，将返回值按照上述规则判断能否转换字符串类型，如果都不满足，则会调用对象的 `valueOf()` 函数获取返回值，并将返回值重新按照上述规则判断能否转换成字符串类型，如果也不满足，则会抛出类型转换的异常。

         ```javascript
         // 如果两者返回的都是对象类型而无法转换为 String 类型，则抛出异常
         var obj = {
             age: '21',
             valueOf: function () {
                 return []
             },
             toString: function () {
                 return []
             }
         }
         
         String(obj)	// TypeError: Cannot convert object to primitive value
         ```

3.    `new String()` 构造函数

     `new String()` 构造函数使用 `new` 运算符生成 `String` 类型的实例，对于传入的参数同样采用和上述 `String()` 函数一样的类型转换策略，最后的返回值是一个 String 类型对象的实例。

     ```javascript
     new String('hello JavaScript')	// String {"hello JavaScript"}
     ```

4.   比较

     使用第一种字符串字面量方式和第二种直接调用 `String()` 函数的方式得到的字符串都是基本字符串，而通过第三种方式，`new` 运算符生成的字符串是字符串对象。

     基本字符串在作比较时，只需要比较字符串的值即可；而在比较字符串对象时，比较的是对象所在的地址。

     ```javascript
     var str = 'hello'
     var str2 = String(str)
     var str3 = String('hello')
     // 以下三者都是使用 new 运算符生成的 String 类型的实例，彼此地址不同
     var str4 = new String(str)
     var str5 = new String(str)
     var str6 = new String('hello')
     
     str === str2   // true
     str2 === str3  // true
     str3 === str4  // false
     str4 === str5  // false
     str5 === str6  // false
     
     // 基本字符串和字符串对象比较，判断严格相等时也返回 false
     str === str4	// false
     str2 === str4	// false
     ```

在 String 对象的原型链上有一系列的函数，如 `indexOf()`、`substring()`、`slice()` 等，通过 String 对象的实例可以调用这些函数做字符串的处理，采用字面量方式定义的字符串（即没有通过 `new` 运算符生成 String 对象的实例）也能够直接调用原型链上的函数。

实际上基本字符串本身没有字符串对象的函数，当基本字符串调用这些函数时，JavaScript 会自动将基本字符串转换为字符串对象，形成一种包装类型，这样基本字符串就可以正常调用字符串对象的方法了。

基本字符串和字符串对象在经过 `eval()` 函数处理时，会产生不同的结果。`eval()` 函数会将基本字符串作为源代码处理，如果涉及表达式会直接进行运算，返回运算后的结果；而字符串对象则会被看作对象处理，返回对象本身。

```javascript
var s1 = '2 + 2'               // 字符串字面量
var s2 = new String('2 + 2')   // 字符串对象
console.log(eval(s1))          // 4
console.log(eval(s2))          // String {"2 + 2"}
```

##### 1.5.2 String 类型常见算法

1.   字符串逆序输出

     -   方法 1：借助数组的 `reverse()` 函数

         首先将字符串转换为字符数组，然后通过调用数组原生的 `reverse()` 进行逆序，得到逆序数组后再通过调用 `join()` 得到逆序字符串。

         ```javascript
         function reverseString1(str) {
             return str.split('').reverse().join('')
         }
         ```

     -   方法 2：利用字符串本身的 `charAt()` 函数

         从尾部开始遍历字符串，然后利用 `charAt()` 函数获取字符并逐个拼接，得到最终的结果。`charAt()` 函数接收一个索引数字，返回该索引位置对应的字符。

         ```javascript
         function reverseString2(str) {
             var result = ''
             for(var i=str.length-1; i>=0; i--) {
                 result += str.charAt(i)
             }
             return result
         }
         ```

     -   方法 3：通过递归实现

         递归从字符串最后一个位置索引开始，通过 `charAt()` 函数获取一个字符，并拼接到结果字符串中，递归结束的条件是位置索引小于 0。

         ```javascript
         function reverseString3(strIn,pos,strOut){
            if(pos<0)
               return strOut
            strOut += strIn.charAt(pos--)
            return reverseString3(strIn,pos,strOut)
         }	// 调用时 strOut 传入空字符串
         ```

     -   方法 4：通过 `call()` 函数来改变 `slice()` 函数的执行主体

         调用 `call()` 函数后，可以让字符串具有数组的特性，在调用未传入参数的 `slice()` 函数后，得到的是一个与自身相等的数组，从而可以直接调用 `reverse()` 函数，最后再通过调用 `join()` 函数，得到逆序字符串。

         ```javascript
         function reverseString4(str) {
            // 改变 slice() 函数的执行主体，得到一个数组
            var arr = Array.prototype.slice.call(str)
            // 调用 reverse() 函数逆序数组
            return arr.reverse().join('')
         }
         ```

     -   方法 5：借助栈的先进后出

         ```javascript
         // 构造栈
         function Stack() {
            this.data = [] // 保存栈内元素
            this.top = 0   // 记录栈顶位置
         }
         // 原型链增加出栈、入栈方法
         Stack.prototype = {
            // 入栈: 先在栈顶添加元素，然后元素个数加 1
            push: function push(element) {
                this.data[this.top++] = element
            },
            // 出栈: 先返回栈顶元素，然后元素个数减 1
            pop: function pop() {
                return this.data[--this.top]
            },
            // 返回栈内的元素个数，即长度
            length: function () {
                return this.top
            }
         };
         
         // 实现 reverse 方法
         function reverseString5(str) {
            // 创建一个栈的实例
            var s = new Stack()
            // 将字符串转成数组
            var arr = str.split('')
            var len = arr.length
            var result = ''
            // 将元素压入栈内
            for(var i = 0; i < len; i++){
               s.push(arr[i])
            }
            // 输出栈内元素
            for(var j = 0; j < len; j++){
               result += s.pop(j)
            }
            return result
         }
         ```

2.   统计字符串中出现次数最多的字符及出现的次数

     -   方法 1：

         通过 key-value 形式的对象来存储字符串以及字符串出现的次数，然后逐个判断出现次数最大值，同时获取对应的字符。有两种实现方式：

         ```javascript
         // 实现方式 1
         function getMaxCount(str) {
            var json = {};
            // 遍历 str 的每一个字符得到 key-value 形式的对象
            for (var i = 0; i < str.length; i++) {
                // 判断 json 中是否有当前 str 的字符
                if (!json[str.charAt(i)]) {
                    // 如果不存在，就将当前值添加到 json 中去
                    json[str.charAt(i)] = 1;
                } else {
                    // 如果存在，则让 value 值加 1
                    json[str.charAt(i)]++;
                }
            }
            // 存储出现次数最多的值和出现次数
            var maxCountChar = '';
            var maxCount = 0;
            // 遍历 json 对象，找出出现次数最大的值
           for (var key in json) {
               // 如果当前项大于下一项
               if (json[key] > maxCount) {
                   // 就让当前值更改为出现最多次数的值
                   maxCount = json[key];
                   maxCountChar = key;
               }
            }
            //最 终返回出现最多的值以及出现次数
            return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
         }
         
         // 实现方式 2
         function getMaxCount2(str) {
            var json = {};
            var maxCount = 0, maxCountChar = '';
            str.split('').forEach(function (item) {
                // 判断 json 对象中是否有对应的 key
                if (!json.hasOwnProperty(item)) {
                    // 当前字符出现的次数
                    var number = str.split(item).length - 1;
                    // 直接与出现次数最大值比较，并进行更新
                    if(number > maxCount) {
                        // 写入 json 对象
                        json[item] = number;
                        // 更新 maxCount 与 maxCountChar 的值
                        maxCount = number;
                        maxCountChar = item;
                    }
                }
            });
         
            return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
         }
         ```

     -   方法 2：

         对字符串进行排序，然后通过 `lastIndexOf()` 函数获取索引值后，判断索引值的大小以获取出现的最大次数。

         ```javascript
         function getMaxCount3(str) {
            // 定义两个变量，分别表示出现最大次数和对应的字符
            var maxCount = 0, maxCountChar = '';
            // 先处理成数组，调用 sort() 函数排序,再处理成字符串
            str = str.split('').sort().join('');
            for (var i = 0, j = str.length; i < j; i++) {
                var char = str[i];
                // 计算每个字符串出现的次数
                var charCount = str.lastIndexOf(char) - i + 1;
                // 与次数最大值作比较
                if (charCount > maxCount) {
                    // 更新 maxCount 和 maxCountChar 的值
                    maxCount = charCount;
                    maxCountChar = char;
                }
                // 变更索引为字符出现的最后位置
                i = str.lastIndexOf(char);
            }
            return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
         }
         ```

     -   方法 4：

         将字符串进行排序，然后通过正则表达式将字符串进行匹配拆分，将相同字符组合在一起，最后判断字符出现的次数。

         ```javascript
         function getMaxCount4(str) {
            // 定义两个变量，分别表示出现最大次数和对应的字符
            var maxCount = 0, maxCountChar = '';
            // 先处理成数组，调用 sort() 函数排序,再处理成字符串
            str = str.split('').sort().join('');
            // 通过正则表达式将字符串处理成数组(数组每个元素为相同字符构成的字符串)
            var arr = str.match(/(\w)\1+/g);
            for (var i = 0; i < arr.length; i++) {
                // length 表示字符串出现的次数
                var length = arr[i].length;
                // 与次数最大值作比较
                if (length > maxCount) {
                    // 更新 maxCount 和 maxCountChar
                    maxCount = length;
                    maxCountChar = arr[i][0];
                }
            }
            return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
         }
         ```

     -   方法 5：借助 `replace()` 函数

         ```javascript
         function getMaxCount5(str) {
            // 定义两个变量，分别表示出现最大次数和对应的字符
            var maxCount = 0, maxCountChar = '';
            while (str) {
                // 记录原始字符串的长度
                var originCount = str.length;
                // 当前处理的字符
                var char = str[0];
                var reg = new RegExp(char, 'g');
                // 使用 replace() 函数替换处理的字符为空字符串
                str = str.replace(reg, '');
                var remainCount = str.length;
                // 当前字符出现的次数
                var charCount = originCount - remainCount;
                // 与次数最大值作比较
                if (charCount > maxCount) {
                   // 更新 maxCount 和 maxCountChar 的值
                   maxCount = charCount;
                   maxCountChar = char;
                }
            }
            return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
         }
         ```

3.   去除字符串中的重复字符

     -   方法 1：

         使用 key-value 类型的对象存储，key 表示唯一的字符，处理完后将所有的 key 拼接在一起即可得到去重后的结果。

         ```javascript
         function removeDuplicateChar1(str) {
            // 结果数组
            var result = [];
            // key-value 形式的对象
            var json = {};
            for (var i = 0; i < str.length; i++) {
                // 当前处理的字符
                var char = str[i];
                // 判断是否在对象中
                if(!json[char]) {
                    // value 值设置为 false
                    json[char] = true;
                    // 添加至结果数组中
                    result.push(char);
                }
            }
            return result.join('');
         }
         ```

     -   方法 2：

         借助数组的 `filter()` 函数，然后在 `filter()` 函数中使用 `indexOf()` 函数判断。

         ```javascript
         function removeDuplicateChar2(str) {
            // 使用 call() 函数改变 ﬁlter 函数的执行主体
            let result = Array.prototype.ﬁlter.call(str, function (char, index, arr) {
               // 通过 indexOf() 函数与 index 的比较，判断是否是第一次出现的字符
               return arr.indexOf(char) === index;
            });
            return result.join('');
         }
         
         // ES6 的简化写法
         function removeDuplicateChar2(str) {
             return Array.prototype.filter.call(str, (char, index, arr) => arr.indexOf(char) === index).join('');
         }
         ```

     -   方法 3：

         借助 ES6 中的 Set 数据结构，Set 具有自动去重的特性，可以直接将数组元素去重。

         ```javascript
         function removeDuplicateChar3(str) {
            // 字符串转换的数组作为参数，生成 Set 的实例
            let set = new Set(str.split(''));
             // 将 set 重新处理为数组，然后转换成字符串
            return [...set].join('');
         }
         ```

4.   判断一个字符串是否为回文字符串(不区分大小写）

     -   方法 1：

         将字符串按从前往后顺序的字符与按从后往前顺序的字符逐个进行比较，如果遇到不一样的值则直接返回 `false`，否则返回 `true`。

         ```javascript
         function isPalindromicStr1(str) {
            // 空字符则直接返回 true
            if (!str.length) {
                return true;
            }
            // 统一转换成小写，同时转换成数组
            str = str.toLowerCase().split('');
            var start = 0, end = str.length - 1;
            // 通过 while 循环判断正序和倒序的字母
            while(start < end) {
               // 如果相等则更改比较的索引
               if(str[start] === str[end]) {
                   start++;
                   end--;
               } else {
                   return false;
               }
            }
            return true;
         }
         ```

     -   方法 2：

         和方法 1 思想相同，但采用递归实现：

         ```javascript
         function isPalindromicStr2(str) {
            // 字符串处理完成，则返回 true
            if(!str.length) {
               return true;
            }
            // 字符串统一转换成小写
            str = str.toLowerCase();
            let end = str.length - 1;
            // 当首字符和尾字符不同，直接返回 false
            if(str[0] !== str[end]) {
               return false;
            }
            // 删掉字符串首尾字符，进行递归处理
            return isPalindromicStr2(str.slice(1, end));
         }
         ```

     -   方法 3：

         将字符串进行逆序处理，然后与原来的字符串进行比较，如果相等则表示是回文字符串，否则不是回文字符串。

         ```javascript
         function isPalindromicStr3(str) {
            // 字符串统一转换成小写
            str = str.toLowerCase();
            // 将字符串转换成数组
            var arr = str.split('');
            // 将数组逆序并转换成字符串
             var reverseStr = arr.reverse().join('');
             return str === reverseStr;
         }
         ```

### 2. 运算符

#### 2.1 等于运算符

-   `==` 双等于，会将两端的变量进行隐式类型转换，然后比较值的大小。
-   `===` 三（全）等于，优先比较数据类型，数据类型相同才去判断值的大小，如果类型不同则直接返回 `false`。

##### 2.1.1 三等于

如果比较的值类型不相同，则直接返回 `false`。

```javascript
1 === '1'; 			// false
true === 'true';  	// false 
```

基本类型数据存在包装类型。在未使用 `new` 操作符时，简单类型的比较实际为值的比较，而使用了 `new` 操作符后，实际得到的是引用类型的值，在判断时会因为类型不同而直接返回 `false`。

```javascript
1 === Number(1);  					// true
1 === new Number(1);  				// false
'hello' === String('hello');  		// true
'hello' === new String('hello'); 	// false
```

如果比较的值都是数值类型，则直接比较值的大小，相等则返回 `true`，否则返回 `false`。如果参与比较的值中有任何一方为 `NaN`，则返回 `false。

```javascript
23 === 23;   // true
34 === NaN;  // false
NaN === NaN; // false
```

如果比较的值都是字符串类型，则判断每个位置的字符是否一样，如果一样则返回 `true`，否则返回 `false`。

如果比较的值都是 Boolean 类型，则两者同时为 `true` 或者 `false` 时，返回 `true`，否则返回 `false`。

如果比较的值都是 `null` 或者 `undefined`，则返回 `true`；如果只有一方为 `null` 或者 `undefined`，则返回 `false`。

```javascript
null === null;   			// true
undeﬁned === undeﬁned;   	// true
null === undeﬁned;   		// false
```

如果比较的值都是引用类型，则比较的是引用类型的地址，当两个引用指向同一个地址时，则返回 `true`，否则返回 `false`。

```javascript
var a = [];
var b = a;
var c = [];
console.log(a === b); 	// true
console.log(a === c); 	// false
console.log({} === {}); // false
```

实际上，如果不是通过赋值运算符 `=` 将定义的引用类型的值赋予变量，那么引用类型的值在比较后都会返回 `false`，所以空数组或者空对象的直接比较返回的是 `false`。

```javascript
[] === [];  // false
{} === {};  // false
```

只要有一个变量是通过 `new` 操作符得到的，都会返回 `false`，包括基本类型的包装类型。

```javascript
'hello' === new String('hello');  				// false
new String('hello') === new String('hello'); 	// false

// 函数对象类型
function Person(name) {
   this.name = name;
}
var p1 = new Person('zhangsan');
var p2 = new Person('zhangsan');
console.log(p1 === p2);  // false
```

##### 2.1.2 双等于

如果比较的值类型相同，则采用与三等于运算符一样的规则。

```javascript
123 == 123;    	// true
false == false; // true
[] == [];       // false
{} == {};       // false
```

如果比较的值类型不同，按照下面规则转换后再进行比较：

-   如果比较的一方是 `null` 或者 `undefined`，只有在另一方是 `null` 或者 `undefined` 的情况下才返回 `true`，否则返回 `false`

    ```javascript
    null == undeﬁned;      	// true
    null == 1;             	// false
    null == false;         	// false
    undeﬁned == 0;         	// false
    undeﬁned == false;    	// false
    ```

-   如果比较的是字符串和数值类型数据，则会将字符串转换为数值后再进行比较，如果转换后的数值相等则返回 `true`，否则返回 `false`

    ```javascript
    1 == '1';     // true
    123 == '123'; // true
    
    // 如果字符串是十六进制的数据，会转换为十进制后再进行比较
    '0x15' == 21;  // true
    
    // 字符串不支持八进制的数据，如果字符串以 0 开头，则 0 会直接省略，后面的值当作十进制返回
    '020' == 16;  // false
    '020' == 20;  // true
    ```

-   如果任一类型是 boolean 值，则会将 boolean 类型的值进行转换，`true` 转换为 `1`，`false` 转换为 `0`，然后进行比较

    ```javascript
    '1' == true;    // true
    '0' == false;   // true
    '0.0' == false; // true
    'true' == true; // false	'true' 会被转换为 NaN
    ```

-   如果其中一个值是对象类型，另一个值是基本数据类型或者对象类型，则会调用对象的 `valueOf()` 函数或者 `toString()` 函数，将其转换成基本数据类型后再作比较

#### 2.2 `typeof` 运算符

功能：用于返回操作数的数据类型

两种语法格式：

```javascript
typeof 操作数
typeof(操作数)
```

括号有的时候是必须的，如果不加上括号将会因为优先级的问题得不到预期的结果。

```javascript
Undefined	-->		"undefined"
Null		-->		"object"
Boolean		-->		"boolean"
Number		-->		"number"
String		-->		"string"
Symbol		-->		"symbol"
Function	-->		"function"
Object		-->		"object"
```

1.   Undefined

     `typeof` 运算符在处理以下 3 种值时都会返回 `"undefined"`：

     -   `undefined` 本身
     -   未声明的变量
     -   已声明但未初始化的变量

     ```javascript
     var declaredButUndeﬁnedVariable;
     typeof undeﬁned === 'undeﬁned';    					// true
     typeof declaredButUndeﬁnedVariable === 'undeﬁned';  // true，已声明未初始化的变量
     typeof undeclaredVariable === 'undeﬁned';  			// true，未声明的变量
     ```

2.   Boolean

     `typeof` 运算符在处理这两个值以及它们的包装类型时都会返回 `"boolean"`，但是不推荐使用包装类型的写法。

     ```javascript
     typeof true === 'boolean';          // true
     typeof false === 'boolean';         // true
     typeof Boolean(true) === 'boolean'; // true，不推荐
     ```

3.   Number

     对于 Number 类型的数据，可以概括为以下这些值，`typeof` 运算符在处理时会返回 `"number"`：

     -   数字
     -   Number 类型的静态变量，如 `Number.MAX_VALUE`、`Number.EPSILON` 等
     -   `Math` 对象的静态变量值，如 `Math.PI`、`Math.LN2`
     -   `NaN`
     -   `Infinity` 和 `-Infinity`
     -   数值类型的包装类型，如 `Number(1)`、`Number(123)`，但不推荐

4.   String

     对于 String 类型的数据，可以概括为以下这些值，`typeof` 运算符在处理时会返回 `"string"`：

     -   任何类型的字符串，包括空字符串和非空字符串
     -   返回值为字符串类型的表达式
     -   字符串类型的包装类型，如 `String('hello')`、`String('hello' + 'world')`，但不推荐

5.   Symbol

     Symbol 类型是在 ES6 中新增的原生数据类型，表示一个独一无二的值，`typeof` 运算符处理后得到的返回值为 `"symbol"`。

     ```javascript
     typeof Symbol() === 'symbol';      // true
     typeof Symbol('foo') === 'symbol'; // true
     ```

6.   Function

     对于 Function 类型的数据，可以概括为以下这些值，`typeof` 运算符在处理时会返回 `"function"`：

     -   函数的定义，包括函数声明或者函数表达式两种形式
     -   使用 `class` 关键字定义的类，（`class`是在 ES6 中新增的关键字，它不是一个全新的概念，原理依旧是原型继承，本质上是一个 Function）
     -   某些内置对象的特定函数，如 `Math.sin()` 、`Number.isNaN()` 等
     -   Function 类型对象的实例，一般通过 `new` 关键字得到

     ```javascript
     var foo = function () {};
     function foo2() {}
     
     typeof foo === 'function';       		// true, 函数表达式
     typeof foo2 === 'function';      		// true, 函数声明
     typeof class C{} === 'function'; 		// true
     typeof Math.sin === 'function';  		// true
     typeof new Function() === 'function';  	// true，new 操作符得到 Function 类型的实例
     ```

7.   Object

     对于 Object 类型的数据，可以概括为以下这些值，`typeof` 运算符在处理时会返回 `"object"`：

     -   对象字面量形式
     -   数组
     -   所有构造函数通过 `new` 操作符实例化后得到的对象，如 `new Date()`、`new function(){}`，但 `new Function(){}` 除外
     -   通过 `new` 操作符得到的基本数据类型的包装类型对象，如 `new Boolean(true)`、`new Number(1)`，但不推荐

     ```javascript
     typeof {a:1} === 'object';      		// true, 对象字面量
     typeof [1, 2, 4] === 'object';  		// true, 数组
     typeof new Date() === 'object'; 		// true, Date 对象的实例
     // 下面的代码不推荐使用
     typeof new Boolean(true) === 'object';  // true
     typeof new Number(1) === 'object';      // true
     typeof new String("abc") === 'object';  // true
     ```

     >   不推荐使用包装类型的原因：使用了 `new` 操作符与没有使用 `new` 操作符得到的值在通过 `typeof` 运算符处理后得到的结果是不一样的，很容易让人混淆。

8.   `typeof` 运算符区分对待 Object 类型和 Function 类型

     函数在 ECMAScript 中是对象，不是一种数据类型，但函数有一些特殊的属性，因此通过 `typeof` 运算符来区分函数和其他对象是有必要的。

9.   `typeof` 运算符对 `null` 的处理

     在 JavaScript 中，每种数据类型都会使用 3 bit 表示：

     -   `000` 表示 Object 类型的数据
     -   `001` 表示 Int 类型的数据
     -   `010` 表示 Double 类型的数据
     -   `100` 表示 String 类型的数据
     -   `110` 表示 Boolean 类型的数据

     由于 `null` 代表的是空指针，大多数平台中值为 `0x00`，因此 `null` 的类型标签就成了 `0`，所以使用 `typeof` 运算符时会判断为 `object` 类型，返回 `"object"`。

10.   `typeof` 的括号有时是必要的

      ```javascript
      // typeof 的优先级高于 +, 低于 ()
      var number = 123;
      typeof (number + ' hello');  // "string"
      typeof number + ' hello';    // "number hello"
      
      typeof 1 / 0;				// "NaN"	字符串除以 0 为 NaN
      typeof(1 / 0)				// "number"
      ```

#### 2.3 逗号运算符

逗号可以作为一个运算符，作用是将多个表达式连接起来，从左至右执行。

语法：`表达式1, 表达式2, ..., 表达式n`

从左到右执行，最后返回表达式 n 的结果。

```javascript
x = 8 * 2, x * 4	// x = 64
```

1.   在 `for` 循环中批量执行表达式

     ```javascript
     for(var i = 0, j = 10; i < 5, j < 15; i++, j++) {
         console.log(i, j);
     }
     // 0 10
     // 1 11
     // 2 12
     // 3 13
     // 4 14
     ```

2.   用于交换变量，无须引进中间变量

     ```javascript
     var a = 'a';
     var b = 'b';
     // 方案 1
     a = [b, b = a][0];		// b = a, a = [b, a][0]
     // 方案 2
     a = [b][b = a, 0];		// b = a, a= [b][0]
     ```

3.   简化代码

     ```javascript
     // 原代码
     if (x) {
         foo();
         return bar();
     } else {
         return 1;
     }
     
     // 简化代码
     x ? (foo(), bar()) : 1;
     ```

4.   使用小括号提升逗号运算符的优先级

     ```javascript
     var a = 20;
     // 赋值运算符的优先级比逗号高
     var b = ++a, 10;
     console.log(b);		// Uncaught SyntaxError: Unexpected number
     
     var a = 20;
     var b = (++a, 10);
     console.log(b);		// 10
     ```

#### 2.4 运算符优先级

```javascript
a = b = 10;		// a = 10, b = 10
6 > 4 > 3;		// false	6 > 4 -- true	true > 3 -- false
```

JavaScript 运算符优先级（从上到下，从高到低）：

![](https://res.weread.qq.com/wrepub/epub_34232297_4)

![](https://res.weread.qq.com/wrepub/epub_34232297_5)

<img src="https://res.weread.qq.com/wrepub/epub_34232297_6" alt="image-20221022140049451" style="zoom:80%;" />

```javascript
var arr = [];
var y = arr.length <= 0 || arr[0] === undefined ? x : arr[0];
// 等价于
var y = ((arr.length <= 0) || (arr[0] === undefined)) ? x : arr[0];
```

圆括号不是运算符，不具有求值功能，只改变运算的优先级。

```javascript
// 因为圆括号不具备求知功能, 所以下面的代码可以运行
var x = 1;
(x) = 2;	// x = 2
```

函数放在小括号中，会返回函数本身。如果小括号紧跟在函数的后面，就表示调用函数。

```javascript
function f() {
    return 1;
}

(f);	// function f() { return 1; }
f();	// 1
```

小括号之中只能放置表达式，如果将语句放在小括号之中，就会报错。

```javascript
(var a = 1);	// SyntaxError: Unexpected token var
```

### 3. `toString()` 和 `valueOf()`

在 JavaScript 中，`toString()` 函数与 `valueOf()` 函数解决的是值的显示和运算的问题，所有引用类型都拥有这两个函数。

#### 3.1 `toString()`

`toString()` 的作用是把一个值转换为字符串，并返回结果。Object 类型的 `toString()` 默认的返回结果是 `"[object Object]"`，自定义新的类时，可以重写 `toString()` 函数，返回可读性更高的结果。

在 JavaScript 中，Array，Function，Date 等类型都实现了自定义的 `toString()` 函数：

-   Array 的 `toString()` 返回以逗号分隔构成的数组成员字符串，如 `[1,2,3].toString()` 结果为 `'1,2,3'`

-   Function 的 `toString()` 返回函数的文本定义，如 `(function (x) { return x * 2; }).toString()` 的结果为 `"function (x) { return x * 2; }"`

-   Date 的 `toString()` 返回具有可读性的时间字符串，如 `new Date().toString()` 的结果为 `"Sun Nov 25 2018 15:00:16 GMT+0800"`（中国标准时间）

#### 3.2 `valueOf()`

`valueOf()` 的作用是返回最适合引用类型的原始值，如果没有原始值，则会返回引用类型自身。Object 类型数据的 `valueOf()` 默认的返回结果是 `"{}"`，即一个空的对象字面量。

-   Array 的 `valueOf()` 返回的是数组本身，如 `[1, 2, 3].valueOf()` 的结果为 `"[1,2,3]"`

-   Function 的 `valueOf()` 返回的是函数本身，如 `(function (x) { return x *2; }).valueOf()` 的结果为 `"function (x) { return x * 2; }"`
-   Date 的 `valueOf()` 返回的是指定日期的时间戳，如 `new Date().valueOf()` 的结果为 `"1666419746355"`。

#### 3.3 引用类型转换为 String 类型

引用类型转换为 String 类型时，一般用于数据展示，转换规则如下：

-   如果对象具有 `toString()` 函数，则会优先调用 `toString()` ，如果它返回的是一个原始值，则会直接将这个原始值转换为字符串表示，并返回该字符串
-   如果对象没有 `toString()` 函数，或 `toString()` 返回的不是一个原始值，则再去调用 `valueOf()` 函数，如果 `valueOf()` 函数返回的结果是一个原始值，则会将这个结果转换为字符串表示，并返回该字符串
-   如果通过 `toString()` 或 `valueOf()` 函数都无法获得一个原始值，则会直接抛出类型转换异常

#### 3.4 引用类型转换为 Number 类型

引用类型转换为 Number 类型时，一般用于数据运算，转换规则如下：

-   如果对象具有 `valueOf()` 函数，则会优先调用 `valueOf()` ，如果 `valueOf()` 函数返回一个原始值，则会直接将这个原始值转换为数字表示，并返回该数字
-    如果对象没有 `valueOf()` 函数，或 `valueOf()` 函数返回的不是原生数据类型，则再去调用 `toString()` 函数，如果 `toString()` 函数返回的结果是一个原始值，则会将这个结果转换为数字表示，并返回该数字
-   如果通过 `toString()` 或 `valueOf()` 函数都无法获得一个原始值，则会直接抛出类型转换异常。

>   事实上，对除了 Date 类型以外的引用类型数据转换为原生数据类型时，如果是用于数据运算，则会优先调用 `valueOf()` 函数，在 `valueOf()` 无法满足条件时，则会继续调用 `toString()` ，如果 `toString()` 函数也无法满足条件，则会抛出类型转换异常；如果是用于数据展示，则会优先调用 `toString()` 函数，在 `toString()` 无法满足条件时，则会继续调用 `valueOf()` ，如果 `valueOf()` 函数也无法满足条件，则会抛出类型转换异常。

```javascript
[] == 0;	// true
// 1. 调用 [] 的 valueOf() 函数，返回的是数组本身, 不是原生数据类型
// 2. 调用 [] 的 toString() 函数，返回数组元素以逗号为分隔符构成的字符串, 空数组返回空字符串, 它与数字 0 非严格相等

[1] == 1;	// true
// 1. 调用 [] 的 valueOf() 函数，返回的是数组本身, 不是原生数据类型
// 2. 调用 [] 的 toString() 函数，返回数组元素以逗号为分隔符构成的字符串, 返回空字符串 "1", 它与数字 1 非严格相等

var obj = {
    i: 10,
    toString: function () {
        console.log('toString');
        return this.i;
    },
    valueOf: function () {
        console.log('valueOf');
        return this.i;
    }
};

+obj;  			// valueOf		-- 返回值为 10
'' + obj;  		// valueOf		-- 返回值为 '10'
String(obj);  	// toString		-- 返回值为 '10'
Number(obj);  	// valueOf		-- 返回值为 10
obj == '10';  	// valueOf		-- 返回值为 true
obj === '10'; 	// 				-- 返回值为 false
```

### 4. 常用判空方法

1.   判断变量为空对象

     -   判断变量为 `null` 或 `undefined`

         ```javascript
         if(obj == null) {} 		// 可以判断 null 或 undeﬁned
         if(obj === undeﬁned) {} // 只能判断 undeﬁned
         ```

     -   判断变量为空对象

         判断一个变量是否为空对象时，可以通过 `for in` 语句遍历变量的属性，然后调用 `hasOwnProperty()` 函数，判断是否有自身存在的属性，如果存在则不为空对象，如果不存在自身的属性（不包括继承的属性），那么变量为空对象。

         ```javascript
         function isEmpty(obj) {
             for(let key in obj) {
                 if(obj.hasOwnProperty(key)) {
                     return false;
                 }
             }
             return true;
         }
         ```

2.   判断变量为空数组

     ```javascript
     arr instanceof Array && arr.length === 0;
     ```

3.   判断变量为字符串

     ```javascript
     str === '' || str.trim().length == 0;
     ```

4.   判断变量是否为 0 或 `NaN`

     ```javascript
     // NaN 和任何值比较都为 false
     !(Number(num) && num) == true;
     ```

5.   `!x == true` 的所有情况

     -   变量为 `null`
     -   变量为 `undefined`
     -   变量为空字符串 `''`
     -   变量为数字 `0`，包括 `+0`、`-0`
     -   变量为 `NaN`

### 5. `switch` 语句

`switch` 语句在很多编程语言中都存在，但在 JavaScript 中，有一些不一样的特性。

#### 5.1 基本语法

```js
switch(expression) {
    case value1:
        statement1;
        break;
    case value2:
        statement2;
        break;
    default:
        statement;
}
```

#### 5.2 JavaScript 中的不同之处

在 JavaScript 中，`switch` 语句可以用来判断任何类型的值，不一定是 Number 类型。

例如：

```js
function getString(str) {
	switch (str) { // 判断条件为字符串
        case '1':
            console.log('10');
            break;
        case '2':
            console.log('20');
            break;
        case '3':
            console.log('30');
            break;
        default:
            console.log('40');
    }
}

getString('2');  // 20
getString('4');  // 40
```

在 JavaScript 中对于 `case` 的比较是采用严格相等 `===` 的：

```js
getString(3) // 40
getString(String('3'));     // '30'
getString(new String('3')); // '40'
```

`switch` 语句甚至可以接收对象类型，比较的是地址是否相同：

```js
// 判断传入的对象，确定执行的语句
function getObj(obj) {
   switch (obj) {
      case ﬁrstObj:
          console.log('这就是第一个对象');
          break;
      case secondObj:
          console.log('这就是第二个对象');
          break;
      default:
          console.log('这是独一无二的对象');
   }
}

function Person() {}

var uniqueObj = new Person();
var ﬁrstObj = new Person();
var secondObj = new Person();

getObj(ﬁrstObj);    // '这就是第一个对象'
getObj(secondObj);  // '这就是第二个对象'
getObj(uniqueObj);  // '这是独一无二的对象'
```



