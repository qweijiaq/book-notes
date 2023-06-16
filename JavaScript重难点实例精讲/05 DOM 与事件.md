DOM（Document Object Model）文档对象模型，用一个逻辑树来表示一个文档，树的每个分支终点都是一个节点，每个节点都包含着对象。

DOM 提供了对文档结构化的表述，通过绑定不同的事件可以改变文档的结构、样式和内容，从而能实现“动态”的页面。

### 1. DOM 选择器

DOM 选择器用于快速定位 DOM 元素。在原生的 JavaScript 中有提供根据 `id`、`name` 等属性来查找的传统选择器，也有新型的、更高效的 `querySelector` 选择器和 `querySelectorAll` 选择器，支持丰富的元素、属性、内容选择等。

#### 1.1 原生的选择器

1.   通过 `id` 定位

     JavaScript 提供了 `getElementById()` 函数，通过 `id` 定位元素，返回匹配到 `id` 的**第一个元素**。

     >   `id` 应该是唯一的，不能重复，即使可能不报错，但应该遵守。

     理论上不应该存在相同的 `id`，当具有相同 `id` 的元素时，除了第一个元素能被匹配到外，其他元素都会被忽略。

2.   通过 `class` 定位

     JavaScript 提供了 `getElementsByClassName()` 函数，通过类名定位元素，返回由匹配到的元素构成的 HTMLCollection 对象，它是一个**类数组**结构。

3.   通过 `name` 属性定位

     JavaScript 提供了 `getElementsByName()` 函数，通过元素的 `name` 属性进行定位，返回由匹配到的元素构成的 NodeList 对象，它是一个**类数组**结构。

4.   通过标签名定位

     JavaScript 提供了 `getElementsByTagName()` 函数，通过标签名定位元素，返回由匹配到的元素构成的 HTMLCollection 对象，它是一个**类数组**结构。

     >   NodeList 对象和 HTMLCollection 对象都是类数组，在结构上很相似，但原型不同，后面会分析两者的异同。

5.   `document.all` 在早期是 IE 支持的属性，而现在的浏览器也都提供了支持，但是在实现细节上有些差异，所以不推荐使用。

#### 1.2 新增的选择器

使用传统的 `id`、`name`、`class` 等选择器来查找元素时，只能调用 `document` 具有的函数，在查找特定元素的子元素时不太方便。为了能更高效地使用选择器，让其定位到特定的元素或者子元素中，于是诞生了新型的 `querySelector` 和 `querySelectorAll` 选择器。这两个选择器是在 W3C DOM4 中新增的，都是按照 CSS 选择器的规范来实现的。

1.   `querySelector` 选择器

     返回值是**在基准元素下**，选择器匹配到的元素集合中的第一个元素。

     语法如下：

     ```javascript
     // baseElement 是基准元素，可以为 Document，也可以为基本的 Element
     // selectors 是一个标准的 CSS 选择器，而且必须是合法的选择器，否则会引起语法错误
     element = baseElement.querySelector(selectors)
     ```

     匹配的过程中不仅仅针对基准元素的后代元素，实际上会遍历整个文档结构，包括基准元素和它的后代元素以外的元素。实际处理过程是首先创建一个匹配元素的初始列表，然后判断每个元素是否为基准元素的后代元素，第一个属于基准元素的后代元素将会被返回。

     下面验证该选择器的匹配过程：

     ```html
     <div>
         <h5>Original content</h5>
         <span>outside span</span>
         <p class="content">
             inside paragraph
             <span>inside span</span>
             inside paragraph
         </p>
     </div>
     
     <script>
         var baseElement = document.querySelector("p")
         console.log(baseElement.querySelector("div span").innerText)   // inside span
     </script>
     ```

     第一行代码获取的基准元素为 `p` 元素，第二行代码中的选择器为 `"div span"`。虽然在 `p` 元素中没有 `div` 元素，却依旧能匹配到 `span` 元素。这是因为在匹配过程会优先找出 `div` 元素下 `span` 元素的集合，然后判断 `span` 元素是否属于 `p` 元素的子元素，最后返回第一个匹配到的 `span` 元素值。

     >   也就是说，“基准”指的是判断结果的“基准”，而非判断过程的“基准”。

2.   `querySelectorAll` 选择器

     `querySelectorAll` 选择器与 `querySelector` 选择器类似，区别在于它会返回基准元素下匹配到的所有子元素，返回值是一个 NodeList 集合。

     `querySelectorAll` 选择器匹配过程与 `querySelector` 选择器一样，优先获取所有匹配元素的集合，然后判断每个元素是否属于基准元素。如果属于则返回结果，最终返回一个 `NodeList` 对象。

     ```html
     <div id="my-id">
         <img src="" alt="" id="inside">
         <div class="lonely"></div>
         <div class="outer">
             <div class="inner"></div>
         </div>
     </div>
     
     <script>
         var firstArr = document.querySelectorAll("#my-id div div")
         var secondArr = document.querySelector("#my-id").querySelectorAll('div div')
     
         console.log(firstArr)
         console.log(secondArr)
     </script>
     ```

     运行结果：

     ![](http://emlog-source.gopher.fit/upload/7NoZ0e20230615213525.png)

     对于 `firstArr`，`querySelectorAll` 选择器的调用方是 `document`，则基准元素为 `document`；执行 CSS 选择器，匹配到的元素只有一个；对于 `secondArr`，先通过 `querySelector` 选择器确定基准元素是 `id` 为 `"my-id"` 的元素，然后执行 CSS 选择器，选择器的内容是匹配 `div` 元素中的子 `div` 元素，有 3 个元素是匹配的，紧接着判断这 3 个匹配的元素是否为基准元素的子元素，发现它们都是处于基准元素内部的，最终这 3 个值构成一个 NodeList 集合返回。

     前面说到，当具有相同 `id` 的元素时，`getElementById` 只能匹配到第一个元素，但 `querySelectorAll` 选择器可以匹配到所有相同 `id` 的元素（不过，应该极力避免这种情况）。

### 2. HTMLCollection 和 NodeList 对象

前面说到，有的选择器返回 HTMLCollection 对象，有的返回 NodeList 对象，那么两者有什么区别呢？

先看下面这段代码，主要是对 `children` 属性和 `childNodes` 属性的调用：

```html
<div id="main">
    <p class="ﬁrst">ﬁrst</p>
    <p class="second">second<span>content</span></p>
</div>

<script>
    var main = document.getElementById("main")
    console.log(main.children)
    console.log(main.childNodes)
</script>
```

运行结果：

![](http://emlog-source.gopher.fit/upload/7NEnHg20230615213525.png)

调用 `children` 属性，返回的是 HTMLCollection 对象；调用 `childNodes` 属性，返回的是 NodeList 对象。`children` 属性和 `childNodes` 属性的不同在本质上是 HTMLCollection 对象和 NodeList 对象的不同。

HTMLCollection 对象与 NodeList 对象都是 DOM 节点的集合，但是在节点处理方式上是有差异的。

1.   HTMLCollection 对象具有 `length` 属性，返回集合的长度，可以通过 `item()` 函数和 `namedItem()` 函数来访问特定的元素。

     -   HTMLCollection 对象可以调用 `item()` 函数，通过序号（从 0 开始）来获取特定的某个节点，超过索引则返回 `null`，如：

         ```javascript
         var main = document.getElementById("main").children
         console.log(main.item(0))	// <p class="first">first</p>
         console.log(main.item(10))	// null 
         ```

     -   `namedItem()` 函数用来返回一个节点，首先通过 `id` 属性去匹配，然后如果没有匹配到则使用 `name` 属性匹配，如果还没有匹配到则返回 `null`。当出现重复的 `id` 或者 `name` 属性时，只返回匹配到的第一个值。

         ```html
         <form id="main">
             <input type="text" id="username">
             <input type="text" name="username">
             <input type="text" name="password">
         </form>
         
         <script>
             var main = document.getElementById("main").children
             console.log(main.namedItem('username'))	// <input type="text" id="username"> -- 先匹配 id
         </script>
         ```

2.   NodeList 对象也具有 `length` 属性，返回集合的长度，也同样具有 `item()` 函数，通过索引定位子元素的位置。

3.   HTMLCollection 和 NodeList 对象不是历史文档状态的静态快照，而是具有**实时性**。对 DOM 树新增或者删除一个相关节点，都会立刻反映在 HTMLCollection 与 NodeList 对象中。HTMLCollection 与 NodeList 对象都是类数组结构，无法直接调用数组的方法，可通过 `call()` 或 `apply()` 函数转换为真正的数组，但此时它们就转变为静态值了，不会再动态反映 DOM 的变化。

     ```html
     <form id="main">
         <input type="text" id="username">
         <input type="text" name="password">
     </form>
     
     <script>
         // 获取 HTMLCollection
         var mainChildren = document.getElementById('main').children
             console.log(mainChildren.length)  // 2
     
         // 新增一个 input 元素
         var newInput = document.createElement('input')
         main.appendChild(newInput)
         console.log(mainChildren.length)  // 3
     
         // 通过 call() 函数处理成数组结构
         mainChildren = Array.prototype.slice.call(mainChildren, 0)
         mainChildren.splice(1, 1)
         console.log(mainChildren.length)  // 2
     
         // 再新增一个 input 元素
         var newInput2 = document.createElement('input')
         main.appendChild(newInput2)
         console.log(mainChildren.length)  // 2
     </script>
     ```
     
4.   NodeList 对象与 HTMLCollection 对象相比，存在一些细微的差异，主要表现在不是所有的函数获取的 NodeList 对象都是实时的。例如，通过 `querySelectorAll()` 函数获取的 NodeList 对象就不是实时的：

     ```html
     <ul id="main">
         <li>文本1</li>
         <li>文本2</li>
         <li>文本3</li>
         <li>文本4</li>
         <li>文本5</li>
     </ul>
     
     <script>
         var main = document.getElementById('main')
         var lis = document.querySelectorAll('ul li')
         console.log(lis.length)	// 5
     
        // 新增 li 元素
         var newLi = document.createElement('li')
         var text = document.createTextNode('文本8')
         newLi.appendChild(text)
         main.appendChild(newLi)
         console.log(lis.length)	// 5
         // 重新获取 li 的集合并输出长度，值为 6
         console.log(document.querySelectorAll('ul li').length)	// 6
     </script>
     ```

综上，HTMLCollection 对象和 NodeList 对象的异同点如下：

-   相同点
    -   都是类数组对象，有 `length` 属性，可以通过 `call()` 函数或 `apply()` 函数处理成真正的数组。
    -   都有 `item()` 函数，通过索引定位元素。
    -   都是实时性的，DOM 树的变化会及时反映到 HTMLCollection 对象和 NodeList 对象上，只是在某些函数调用的返回结果上会存在差异。
-   不同点
    -   HTMLCollection 对象比 NodeList 对象多个 `namedItem()` 函数，可以通过 `id` 或者 `name` 属性定位元素。
    -   HTMLCollection 对象只包含元素的集合，即具有标签名的元素；而 NodeList 对象是节点的集合，既包括元素，也包括节点，如 text 文本节点。

### 3. 常用 DOM 操作

DOM 操作在 jQuery 为主的 **DOM 驱动**时代被极其频繁地使用，虽然在目前**数据驱动**的时代，jQuery 已经逐渐被人所遗弃，但是常用的 DOM 操作仍然是需要了解和掌握的。

文档树是由各种类型节点构成的集合，DOM 操作实际是对文档结构中节点的操作。文档结构树中的节点类型众多，但是操作的主要节点类型为元素节点、属性节点和文本节点。

元素节点和文本节点存在父子关系，而元素节点和属性节点不存在父子关系。

![](http://emlog-source.gopher.fit/upload/7NdLpe20230615213525.png)

常用的 DOM 操作包括查找节点、新增节点、删除节点、修改节点。

#### 3.1 新增节点

新增节点其实包括两个步骤，首先是新建节点，然后将节点添加至指定的位置。

假设 HTML 代码如下，需求是：在 `ul` 的末尾添加一个 `li` 元素，其类名为 `"last"`，内容为 `"新增文本1"`，然后在新增的 `li` 之前再新增第二个 `li`，内容为 `"新增文本2"`。

```html
<ul id="container">
    <li class="ﬁrst">文本1</li>
    <li class="second">文本2</li>
    <li>文本3</li>
    <li id="target">文本4</li>
    <li>文本5</li>
    <li>文本6</li>
</ul>

<script>
    // 获取指定元素
    var container = document.querySelector('#container')
    // 新建 li 元素节点
    var newLiOne = document.createElement('li')
    // 添加 class 属性
    var newLiAttr = document.createAttribute('class')
    newLiAttr.value = 'last';
    newLiOne.setAttributeNode(newLiAttr);
    // 新建文本节点
    var newTextOne = document.createTextNode('新增文本1')
    // 将文本节点作为元素节点的子元素
    newLiOne.appendChild(newTextOne)
    // 使用 appendChild() 函数将新增 li 元素节点添加至末尾
    container.appendChild(newLiOne)
    // 新建第二个 li 元素节点
    var newLiTwo = document.createElement('li')
    // 新建第二个文本节点
    var newTextTwo = document.createTextNode('新增文本2')
    // 将文本节点作为元素节点的子元素
    newLiTwo.appendChild(newTextTwo)
    // 使用 insertBefore() 函数将节点添加至第一个新增节点的前面
    container.insertBefore(newLiTwo, newLiOne)
</script>
```

新增属性节点时，还有另外一种更简单的 `setAttribute()` 函数：

```javascript
var newLiAttr = document.createAttribute('class')
newLiAttr.value = 'last'
newLiOne.setAttributeNode(newLiAttr)
// 上面三行代码可以简写为一行
newLiOne.setAttribute('class', 'last')
```

但是 `setAttribute()` 函数不兼容 IE8 及更早的版本，在使用时需要考虑到所使用的浏览器环境。

>   数据驱动时代的框架们都渐渐不再支持 IE 浏览器，就连微软也不再维护 IE，因此在绝大多数情况下都不需要考虑 IE 的兼容性。

#### 3.2 删除节点

删除节点的操作包含删除元素节点、删除属性节点和删除文本节点这 3 个操作。

```html
<ul id="main">
    <li>文本1</li>
    <li>文本2</li>
    <li>文本3</li>
</ul>
<a id="link" href="http://www.mianshiting.com">面试厅</a>

<script>
    // 1. 删除 ul 的第一个 li 元素节点
    var main = document.querySelector('#main')
    // 不能使用 firstChild 属性获取，因为该属性返回 NodeList 对象中的第一个值，此例中为一个文本对象（换行符）
    var firstChild = main.firstElementChild
    main.removeChild(firstChild)

    // 2. 删除 a 标签的 href 属性
    var link = document.querySelector('#link')
    link.removeAttribute('href')

    // 3. 删除 ul 最后一个 li 元素的 文本节点
    var lastChild = main.lastElementChild
    var textNode = lastChild.childNodes[0]
    lastChild.removeChild(textNode)
</script>
```

关于删除文本节点还有一种比较简单的处理方法，那就是将元素节点的 `innerHTML` 属性设置为空：

```javascript
lastChild.innerHTML = ''
```

这也是更推荐的方法。

#### 3.3 修改节点

修改节点包含着很多不同类型的操作，包括修改元素节点、修改属性节点和修改文本节点。

```html
<div id="main">
    <!-- 测试修改元素节点 -->
    <div id="div1">替换之前的元素</div>
    <!-- 测试修改属性节点 -->
    <div id="div2" class="classA" style="color: green;">这是修改属性的节点</div>
    <!-- 测试修改文本节点 -->
    <div id="last">这是最后一个节点内容</div>
</div>
```

1.   修改元素节点修改元素节点的操作一般是直接将节点元素替换为另一个元素，可以使用 `replaceChild()` 函数来实现。该函数的调用方是父元素，接收两个参数，第一个参数表示新元素，第二个参数表示将要被替换的旧元素，如：

     ```javascript
     // 1. 获取父元素与待替换的元素
     var main = document.querySelector('#main')
     var div1 = document.querySelector('#div1')
     // 2. 创建新元素
     var newDiv = document.createElement('div')
     var newText = document.createTextNode('这是新创建的文本')
     newDiv.appendChild(newText);
     // 3. 使用新元素替换旧的元素
     main.replaceChild(newDiv, div1)
     ```

2.   修改属性节点

     修改属性节点有两种处理方式：一种是通过 `getAttribute()` 函数和 `setAttribute()` 函数获取和设置属性节点值；另一种是直接修改属性名。

     第二种方式有个需要注意的地方是，直接修改的属性名与元素节点中的属性名不一定是一致的。就像 `class` 这个属性，因为它是 JavaScript 中的关键字，是不能直接使用的，所以需要使用 `className` 来代替。

     ```javascript
     var div2 = document.querySelector('#div2')
     // 方法 1: 通过 setAttribute() 函数设置
     div2.setAttribute('class', 'classB')
     // 方法 2: 直接修改属性名，注意不能直接用 class，需要使用 className
     div2.className = 'classC'
     
     // 方法 1: 通过 setAttribute() 函数设置
     div2.setAttribute('style', 'color: red;')
     // 方法 2: 直接修改属性名
     div2.style.color = 'blue'
     ```

3.   修改文本节点

     修改文本节点与删除文本节点一样，将 `innerHTML` 属性修改为需要的文本内容即可。

     ```javascript
     var last = document.querySelector('#last');
     // 直接修改 innerHTML 属性
     last.innerHTML = '这是修改后的文本内容'
     // 如果设置的 innerHTML 属性值中包含 HTML 元素，则会被解析
     // 使用如下代码进行验证
     last.innerHTML = '<p style="color: red">这是修改后的文本内容</p>'
     // 在浏览器中渲染后，可以看到 “这是修改后的文本内容” 为红色
     ```

### 4. 事件流

在浏览器中，JavaScript 和 HTML 之间的交互是通过事件去实现的，常用的事件有代表鼠标单击的 `click` 事件、代表加载的 `load` 事件、代表鼠标指针悬浮的 `mouseover` 事件。在事件发生时，会相对应地触发绑定在元素上的事件处理程序，以处理对应的操作。

通常一个页面会绑定很多的事件，那么具体的事件触发顺序是什么样的呢？这就会涉及事件流的概念，事件流描述的是从页面中接收事件的顺序。事件发生后会在目标节点和根节点之间按照特定的顺序传播，路径经过的节点都会接收到事件。

假设页面上有一个 `table` 表格，分别在 `table` 表格、`tbody` 表格体、`tr` 行、`td` 单元格上绑定了 `click` 事件，在 `td` 上执行了单击的操作，那么将会产生什么样的事件流呢？

第一种事件传递顺序是先触发最外层的 `table` 元素，然后向内传播，依次触发 `tbody`、`tr` 与 `td` 元素。

第二种事件传递顺序先触发由最内层的 `td` 元素，然后向外传播，依次触发 `tr`、`tbody` 与 `table` 元素。

第一种事件传递顺序对应的是**捕获型事件流**，第二种事件传递顺序对应的是**冒泡型事件流**。

一个完整的事件流实际包含了 3 个阶段：`事件捕获阶段 -> 事件目标阶段 -> 事件冒泡阶段`。完整的事件处理阶段如下：

<img src="http://emlog-source.gopher.fit/upload/7Ns1qg20230615213525.png" alt="" style="zoom: 67%;" />

1.   事件捕获阶段

     事件捕获阶段的主要表现是不具体的节点先接收事件，然后逐级向下传播，最具体的节点最后接收到事件。

2.   事件目标阶段

     事件目标阶段表示事件刚好传播到用户产生行为的元素上，可能是事件捕获的最后一个阶段，也可能是事件冒泡的第一个阶段。

3.   事件冒泡阶段

     事件冒泡阶段的主要表现是最具体的元素先接收事件，然后逐级向上传播，不具体的节点最后接收事件。

下面演示捕获型事件流和冒泡型事件流，以 `table` 元素为例：

```html
<table border="1">
    <tbody>
        <tr>
            <td>这是td的元素</td>
        </tr>
    </tbody>
</table>
```

依次给 `table`、`tbody`、`tr`、`td` 绑定 `click` 事件：

```html
<script>
    var table = document.querySelector('table')
    var tbody = document.querySelector('tbody')
    var tr = document.querySelector('tr')
    var td = document.querySelector('td')

    table.addEventListener('click', function () {
        console.log('table触发')
    })

    tbody.addEventListener('click', function () {
        console.log('tbody触发')
    })

    tr.addEventListener('click', function () {
        console.log('tr触发')
    })

    td.addEventListener('click', function () {
        console.log('td触发')
    })
</script>
```

>   使用 `addEventListener()` 函数绑定的事件在默认情况下，即第三个参数默认为 `false` 时，按照冒泡型事件流处理。

点击 `tr` 单元格元素是，结果如下：

```
td触发
tr触发
tbody触发
table触发
```

使用 `addEventListener()` 函数也可以使用捕获型事件流，只需要将第三个参数设置为 `true` 即可：

```javascript
table.addEventListener('click', function () {
    console.log('table触发')
}, true)

tbody.addEventListener('click', function () {
    console.log('tbody触发')
}, true)

tr.addEventListener('click', function () {
    console.log('tr触发')
}, true)

td.addEventListener('click', function () {
    console.log('td触发')
}, true)
```

点击 `tr` 单元格元素是，结果如下：

```
table触发
tbody触发
tr触发
td触发
```

如何混合使用两种事件流类型呢？

```javascript
// 事件捕获
table.addEventListener('click', function () {
    console.log('table触发')
}, true)

// 事件冒泡
tbody.addEventListener('click', function () {
    console.log('tbody触发')
}, false)

// 事件捕获
tr.addEventListener('click', function () {
    console.log('tr触发')
}, true)

// 事件冒泡
td.addEventListener('click', function () {
    console.log('td触发')
}, false)
```

点击 `tr` 单元格元素是，结果如下：

```
table触发
tr触发
td触发
tbody触发
```

完整的事件流是按照事件捕获阶段 -> 事件目标阶段 -> 事件冒泡阶段依次进行的，如果有元素绑定了捕获类型事件，则会优先于冒泡类型事件而先执行。

>   捕获事件流类似于堆栈结构的入栈过程，冒泡事件流类似于堆栈结构的出栈过程，先入栈，再出栈。

### 5. 事件处理程序

事件处理程序，就是响应某个事件的函数，如 `onclick()` 函数、`onload()` 函数就是响应单击、加载事件的函数，对应的是一段 JavaScript 的函数代码。根据 W3C DOM 标准，事件处理程序分为 DOM0、DOM2、DOM3 这 3 种级别的事件处理程序。

>   在 DOM1 中没有定义事件的相关内容，因此没有 DOM1 级事件处理程序。

#### 5.1 DOM0 级事件处理程序

DOM0 级事件处理程序是将一个函数赋值给一个事件处理属性，有两种表现形式。

第一种是先通过 JavaScript 代码获取 DOM 元素，再将函数赋值给对应的事件属性。

```javascript
var btn = document.getElementById("btn")
btn.onclick = function() {}
```

第二种是直接在 html 中设置对应事件属性的值，值有两种表现形式，一种是执行的函数体，另一种是函数名，然后在 `script` 标签中定义该函数。

```html
<button onclick="alert('面试厅');">单击</button>
<button onclick="clickFn()">单击</button>
<script>
    function clickFn() {
        alert('面试厅')
    }
</script>
```

以上两种事件处理程序同时存在时，第一种在 JavaScript 中定义的会覆盖掉后面在 html 标签中定义的事件处理程序。

DOM0 级事件处理程序**只支持事件冒泡阶段**，优缺点如下：

-   优点：简单且可以跨浏览器
-   缺点：一个事件处理程序只能绑定一个函数

如需删除元素绑定的事件，只需要将对应的事件处理程序设置为 `null` 即可：

```javascript
btn.onclick = null
```

#### 5.2 DOM2 级事件处理程序

在 DOM2 级事件处理程序中，当事件发生在节点时，目标元素的事件处理函数就会被触发，而且目标元素的每个祖先节点也会按照事件流顺序触发对应的事件处理程序。DOM2 级事件处理方式规定了添加事件处理程序和删除事件处理程序的方法。

针对 DOM2 级事件处理程序，不同的浏览器厂商制定了不同的实现方式，主要分为 IE 浏览器和非 IE 浏览器：

-   在 IE 10 及以下版本中，只支持事件冒泡阶段，可以通过 `attachEvent()` 函数添加事件处理程序，通过 `detachEvent()` 函数删除事件处理程序。

    ```javascript
    element.attachEvent("on"+ eventName, handler)	// 添加事件处理程序
    element.detachEvent("on"+ eventName, handler)	// 删除事件处理程序
    ```

-   在 IE 11 及其他非 IE 浏览器中，同时支持事件捕获和事件冒泡两个阶段，可以通过 `addEventListener()` 函数添加事件处理程序，通过 `removeEventListener()` 函数删除事件处理程序。

    ```javascript
    element.addEventListener(eventName, handler, useCapture)	// 添加事件处理程序
    element.removeEventListener(eventName, handler, useCapture)	// 删除事件处理程序
    ```

    其中 `useCapture` 参数表示是否支持事件捕获，`true` 表示支持事件捕获，`false` 表示支持事件冒泡，默认状态为 `false`。

在 DOM2 级事件处理程序中，不管是 IE 浏览器还是非 IE 浏览器都支持对同一个事件绑定多个处理函数：

```javascript
var handler1 = function (){}
var handler2 = function (){}

// IE 10 及以下
btn.attachEvent('onclick', handler1)
btn.attachEvent('onclick', handler2)
  
// IE 11 及非 IE
btn.addEventListener('click', handler1)
btn.addEventListener('click', handler2)
```

**在需要删除绑定的事件时，不能删除匿名函数，因为添加和删除的必须是同一个函数**。

下面这种同时绑定和取消 `handler` 函数的情况，可以删除掉绑定的事件：

```javascript
var wrap = document.getElementById('wrap')

var handler = function () {
    console.log('789')
};

// 绑定和取消的是同一个函数，因此可以取消绑定的事件
wrap.addEventListener('click', handler, false)
wrap.removeEventListener('click', handler)
```

而如果采用下面这种方式，则无法取消绑定的事件，因为它们使用的都是匿名函数的形式，绑定与取消的函数并不是同一个：

```javascript
wrap.addEventListener('click', function () {
    console.log('123')
}, false);

wrap.removeEventListener('click', function () {}) // 两个函数不是同一个函数
```

>   `attachEvent()` 和 `addEventListener()` 函数的区别：
>
>   -   `attachEvent()` 只支持事件冒泡，而 `addEventListener()` 既支持事件冒泡，也支持事件捕获（但一个事件只能居其一）。
>
>   -   使用 `attachEvent()` 函数为同一个事件添加多个事件处理函数时，会按照添加的相反顺序执行；而通过 `addEventListener()` 函数为同一个事件添加多个事件处理函数时，会按照添加的顺序执行。
>   -   使用 `attachEvent()` 添加的事件处理程序会在全局作用域中运行，`this` 指向 `window` 对象；使用 `addEventListener()` 添加的事件处理程序在指定的元素内部执行，`this` 指向绑定的元素。

因为浏览器的差异性，需要使用不同的方法来实现 DOM2 级事件处理程序，以下是一段针对不同浏览器所做的封装处理代码：

```javascript
var EventUtil = {
    addEventHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler)
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler)
        } else {
            element["on" + type] = handler
        }
    },
    removeEventHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.removeEventListener(type, handler)
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler)
        } else {
            element["on"+type] = null
        }
    }
}
```

#### 5.3 DOM3 级事件处理程序

DOM3 级事件处理程序是在 DOM2 级事件的基础上重新定义了事件，也添加了一些新的事件。最重要的区别在于 DOM3 级事件处理程序**允许自定义事件**，自定义事件由 `createEvent("CustomEvent")` 函数创建，返回的对象有一个 `initCustomEvent()` 函数，通过传递对应的参数可以自定义事件。该函数可以接收以下 4 个参数：

-   `type`（字符串）：表示触发的事件类型，自定义，如 `"keyDown"`、`"selectedChange"`
-   `bubble`（布尔值）：表示事件是否可以冒泡
-   `cancelable`(布尔值）：表示事件是否可以取消
-   `detail`（对象）：任意值，保存在 `event` 对象的 `detail` 属性中

创建完成的自定义事件，可以通过 `dispatchEvent()` 函数去手动触发，触发自定义事件的元素需要和绑定自定义事件的元素为同一个元素。

下面通过实例来解释自定义事件的处理方式，需求是：在页面初始化时创建一个自定义事件 `myEvent`，页面上有个 `div` 监听这个自定义事件 `myEvent`，同时有一个 `button` 按钮绑定了单击事件；当单击 `button` 时，触发自定义事件，由 `div` 监听到，然后做对应的处理。

```html
<div id="watchDiv">监听自定义事件的div元素</div>
<button id="btn">单击触发自定义事件</button>

<script>
    var customEvent;
    // 创建自定义事件
    (function () {
        	// 判断浏览器是否支持 DOM3 级事件处理程序
            // 返回值为 true 表示浏览器支持, 返回值为 false 表示浏览器不支持
        if (document.implementation.hasFeature('CustomEvents', '3.0')) {
            var detailData = { name: 'Tom' }
            customEvent = document.createEvent('CustomEvent')
            customEvent.initCustomEvent('myEvent', true, false, detailData)
        }
    })()
    // 获取元素
    var div = document.querySelector('#watchDiv')
    // 监听 myEvent 事件
    div.addEventListener('myEvent', function (e) {
        console.log('div监听到自定义事件的执行, 携带的参数为: ', e.detail)
    });
    // 获取元素
    var btn = document.querySelector('#btn')
    // 绑定 click 事件，触发自定义事件
    btn.addEventListener('click', function () {
        div.dispatchEvent(customEvent)
    });
</script>
```

点击按钮的结果为：

```
div监听到自定义事件的执行, 携带的参数为:  {name: 'Tom'}
```

该结果表明，在 `div` 上监听的自定义事件得到了触发，传递的 `detailData` 参数也得以接收。自定义事件支持事件冒泡机制，沿用上面的例子，在 `document` 上增加了对自定义的 `myEvent` 事件的监听。

```javascript
document.addEventListener('myEvent', function () {
    console.log('document监听到自定义事件的执行')
});
```

点击按钮的结果为：

```
div监听到自定义事件的执行, 携带的参数为:  {name: 'Tom'}
document监听到自定义事件的执行
```

可以将 `initCustomEvent()` 函数的第二个参数设置为 `false` 来阻止冒泡。

### 6. Event 对象

事件在浏览器中是以 Event 对象的形式存在的，每触发一个事件，就会产生一个 Event 对象。该对象包含所有与事件相关的信息，包括事件的元素、事件的类型及其他与特定事件相关的信息。

#### 6.1 获取 Event 对象

在给元素绑定特定的事件处理程序时，可以获取到 Event 对象，但是考虑到不同浏览器的差异性，获取 Event 对象的方式也不同。获取 Event 对象的方式有以下两种：

-   在事件处理程序中，Event 对象会作为参数传入，参数名为 `event`（也可以设置为其他名称）
-   在事件处理程序中，通过 `window.event` 属性获取 Event 对象

```javascript
var btn = document.querySelector('#btn')

btn.addEventListener('click', function (event) {
    // 方式 1: event 作为参数传入
    console.log(event)
    // 方式 2: 通过 window.event 获取
    var winEvent = window.event
    console.log(winEvent)
    // 判断两种方式获取的 event 是否相同
    console.log(event == winEvent)
})
```

不同浏览器的表现可能存在差异，有的只支持第一种方式，有的两种都支持。

在获取事件对象时，为了支持不同浏览器，可以通过以下代码来实现兼容：

```javascript
var EventUtil = {
    // 获取事件对象
    getEvent: function (event) {
        return event || window.event
    }
}
```

#### 6.2 获取事件的目标元素

在事件处理程序中，可能经常需要获取事件的目标元素，以便对目标元素做相应的处理。

在 IE 浏览器中，`event` 对象使用 `srcElement` 属性来表示事件的目标元素；而在非 IE 浏览器中，`event` 对象使用 `target` 属性来表示事件的目标元素，为了提供与 IE 浏览器下 `event` 对象相同的特性，某些非 IE 浏览器也支持 `srcElement` 属性。

```javascript
btn.addEventListener('click', function (event) {
    // 获取 event 对象
    var event = EventUtil.getEvent(event) // 前面的代码封装了一个 EventUtil 对象，专门用来处理兼容性
    // 使用两种属性获取事件的目标元素
    var NoIETarget = event.target
    var IETarget = event.srcElement
    console.log(NoIETarget)
    console.log(IETarget)
})
```

在获取事件目标元素时，为了支持不同的浏览器，可以通过以下代码来做兼容：

```javascript
var EventUtil = {
    // ... 
    // 获取事件目标元素
    getTarget: function (event) {
        return event.target || event.srcElement
    }
}
```

#### 6.3 target 和 currentTarget

这两个属性都可以表示事件的目标元素，但是在事件流中两者却有不同的意义。

-   `target` 属性在事件目标阶段，理解为真实操作的目标元素
-   `currentTarget` 属性在事件捕获、事件目标、事件冒泡这 3 个阶段，理解为当前事件流所处的某个阶段对应的目标元素

沿用之前的示例，使用 `table` 元素，分别在 `table`、`tbody`、`tr`、`td` 元素上绑定事件捕获阶段和事件冒泡阶段的 `click` 事件，`click` 事件中输出对应的 `target` 和 `currentTarget` 属性值。

```javascript
// 获取 target 和 currentTarget 属性的元素标签名
function getTargetAndCurrentTarget(event, stage) {
    var event = EventUtil.getEvent(event)
    var stageStr
    if (stage === 'bubble') {
        stageStr = '事件冒泡阶段'
    } else if(stage === 'capture'){
        stageStr = '事件捕获阶段'
    } else {
        stageStr = '事件目标阶段'
    }
    console.log(stageStr,
            'target:' + event.target.tagName.toLowerCase(),
            'currentTarget: ' + event.currentTarget.tagName.toLowerCase())
}

// 事件捕获
table.addEventListener('click', function (event) {
    getTargetAndCurrentTarget(event, 'capture')
}, true)

// 事件捕获
tbody.addEventListener('click', function (event) {
    getTargetAndCurrentTarget(event, 'capture')
}, true)

// 事件捕获
tr.addEventListener('click', function (event) {
    getTargetAndCurrentTarget(event, 'capture')
}, true)

// 事件捕获
td.addEventListener('click', function (event) {
    getTargetAndCurrentTarget(event, 'target')
}, true)

// 事件冒泡
table.addEventListener('click', function (event) {
    getTargetAndCurrentTarget(event, 'bubble')
}, false)

// 事件冒泡
tbody.addEventListener('click', function (event) {
    getTargetAndCurrentTarget(event, 'bubble')
}, false)

// 事件冒泡
tr.addEventListener('click', function (event) {
    getTargetAndCurrentTarget(event, 'bubble')
}, false)

// 事件冒泡
td.addEventListener('click', function (event) {
    getTargetAndCurrentTarget(event, 'target')
}, false)
```

运行结果：

```
事件捕获阶段 target:td currentTarget: table
事件捕获阶段 target:td currentTarget: tbody
事件捕获阶段 target:td currentTarget: tr
事件目标阶段 target:td currentTarget: td
事件目标阶段 target:td currentTarget: td
事件冒泡阶段 target:td currentTarget: tr
事件冒泡阶段 target:td currentTarget: tbody
事件冒泡阶段 target:td currentTarget: table
```

只有在事件目标阶段，`target` 属性和 `currentTarget` 属性才指向同一个元素。

#### 6.4 阻止事件冒泡

下面的示例会产生事件冒泡：

```html
<ul>
    <li>
        <p>姓名:小明</p>
        <p>学号:20180101</p>
        <button class="btn btn-default" id="btn">删除</button>
    </li>
</ul>

<script>
    var li = document.querySelector('li')
    var btn = document.querySelector('#btn')

    li.addEventListener('click', function (event) {
        console.log('单击了li，做对应的处理')
    })

    btn.addEventListener('click', function (event) {
        console.log('单击了button，做对应的处理')
    })
</script>
```

点击按钮，结果为：

```
单击了button，做对应的处理
单击了li，做对应的处理
```

可以通过在 `button` 按钮的 `click` 事件中调用 `event.stopPropagation()` 函数来阻止事件冒泡：

```javascript
btn.addEventListener('click', function (event) {
    var event = EventUtil.getEvent(event)
    // 阻止事件冒泡
    event.stopPropagation()
    console.log('单击了button，做对应的处理')
})
```

在 `event` 对象中还存在一个 `stopImmediatePropagation()` 函数，从函数名可以看出它的作用也是用于阻止事件冒泡的，它和 `stopPropagation()` 的区别主要体现在同一事件绑定多个事件处理程序的情况下：

-   `stopPropagation()` 函数仅会阻止事件冒泡，其他事件处理程序仍然可以调用
-   `stopImmediatePropagation()` 函数不仅会阻止冒泡，也会阻止其他事件处理程序的调用

沿用上面实例的代码，对 `button` 按钮的 `click` 事件增加 3 个事件处理程序，在第二个事件处理程序中使用 `stopPropagation()` 函数来阻止事件冒泡：

```javascript
var li = document.querySelector('li')
var btn = document.querySelector('#btn')

li.addEventListener('click', function (event) {
    console.log('单击了li，做对应的处理')
})

// 第一个事件处理程序
btn.addEventListener('click', function (event) {
    console.log('button的第一个事件处理程序，做对应的处理')
})

// 第二个事件处理程序
btn.addEventListener('click', function (event) {
    var event = EventUtil.getEvent(event)
    // 阻止事件冒泡
    event.stopPropagation()
    console.log('button的第二个事件处理程序，做对应的处理')
    })

// 第三个事件处理程序
btn.addEventListener('click', function (event) {
    console.log('button的第三个事件处理程序，做对应的处理')
})
```

点击按钮，结果为：

```javascript
button的第一个事件处理程序，做对应的处理
button的第二个事件处理程序，做对应的处理
button的第三个事件处理程序，做对应的处理
```

将代码 `event.stopPropagation();` 改为 `event.stopImmediatePropagation();`，点击按钮，结果为：

```
button的第一个事件处理程序，做对应的处理
button的第二个事件处理程序，做对应的处理
```

#### 6.5 阻止默认行为

在众多的 HTML 标签中，有一些标签是具有默认行为的，如：

-   `a` 标签，在单击后默认行为会跳转至 `href` 属性指定的链接中
-   复选框 `checkbox`，在单击后默认行为是选中的效果
-   输入框 `text`，在获取焦点后，键盘输入的值会对应展示到 `text` 输入框中

一般情况下我们是允许标签的默认行为的，就像用户的正常操作，但是在某些时候我们是需要阻止这些标签的默认行为的，如：

-   假如 `a` 标签上显示的文案不符合预期，在单击 `a` 标签时将不会跳转至对应的链接中去
-   复选框 `checkbox` ，假如已选中的复选框在单击的时候不会被取消，依然是选中的状态
-   输入框 `text`，假如限制用户输入的值只能是数字和大小写字母，其他的值不允许输入

阻止元素的默认行为需要通过 `event.preventDefault()` 函数去实现。

假设有需求：限制用户输入的值只能是数字和大小写字母，其他的值则不能输入，如输入其他值则给出提示信息，提示信息在两秒后消失。

本示例中，因为涉及键盘输入，所以需要监听 `keypress` 事件，通过兼容性来处理获取当前按键的值，然后判断输入的值是否合法，从而控制键盘输入的行为。键盘按键值即键盘的每个键有对应的 Unicode 编码：

-   数字的 Unicode 编码范围是 48～57
-   大写字母 A～Z 的 Unicode 编码范围是 65～90
-   小写字母 a～z 的 Unicode 编码范围是 97～122

因为浏览器的兼容性问题，Event 对象提供了多种不同的属性来获取键的 Unicode 编码，分别是 `event.keyCode`、`event.charCode` 和 `event.which`，需要做兼容性处理：

```javascript
var charCode = event.keyCode || event.which || event.charCode
```

根据以上分析，最终所得的代码如下：

```html
<input type="text" id="text">
<div id="tip"></div>

<script>
    var text = document.querySelector('#text')
    var tip = document.querySelector('#tip')
    text.addEventListener('keypress', function (event) {
        var charCode = event.keyCode || event.which || event.charCode
        // 满足输入数字
        var numberFlag = charCode <= 57 && charCode >= 48
        // 满足输入大写字母
        var lowerFlag = charCode <= 90 && charCode >= 65
        // 满足输入小写字母
        var supperFlag = charCode <= 122 && charCode >= 97

        if (!numberFlag && !lowerFlag && !supperFlag) {
            // 阻止默认行为，不允许输入
            event.preventDefault()
            tip.innerText = '只允许输入数字和大小写字母'
        }
        // 设置定时器,清空提示语
        setTimeout(function () {
            tip.innerText = ''
        }, 2000)
    })
</script>
```

### 7. 事件委托

事件委托是利用事件冒泡原理，管理某一类型的所有事件，利用父元素来代表子元素的某一类型事件的处理方式。

#### 7.1 已有元素的事件绑定

场景：假如页面上有一个 `ul` 标签，里面包含 1000 个 `li` 子标签，需要在单击每个 `li` 时，输出 `li` 中的文本内容。

最容易想到的方法是给每个 `li` 标签绑定一个 `click` 事件，在 `click` 事件中输出 `li` 标签的文本内容：

```html
<ul>
    <li>文本1</li>
    <li>文本2</li>
    <li>文本3</li>
    <li>文本4</li>
    <li>文本5</li>
    <li>文本6</li>
    <li>文本7</li>
    <li>文本8</li>
    <li>文本9</li>
    ...
</ul>

<script>
    // 1. 获取所有的 li 标签
    var children = document.querySelectorAll('li')
    // 2. 遍历添加 click 事件处理程序
    for (var i = 0; i < children.length; i++) {
        children[i].addEventListener('click', function () {
            console.log(this.innerText)
        });
    }
</script>
```

但上述方式对浏览器的性能是一个很大的挑战，主要有两个原因：

-   事件处理程序过多导致页面交互时间过长

    假如有 1000 个 `li` 元素，则需要绑定 1000 个事件处理程序，而事件处理程序需要不断地与 DOM 节点进行交互，因此引起浏览器重绘和重排的次数也会增多，从而会延长页面交互时间。

-   事件处理程序过多导致内存占用过多

    在 JavaScript 中，一个事件处理程序其实就是一个函数对象，会占用一定的内存空间。假如页面有 10000 个 `li` 标签，则会有 10000 个函数对象，占用的内存空间会急剧上升，从而影响浏览器的性能。

一个好的解决方式就是利用事件委托机制。事件委托机制的主要思想是将事件绑定至父元素上，然后利用事件冒泡原理，当事件进入冒泡阶段时，通过绑定在父元素上的事件对象来判断当前事件流正在进行的元素，如果和期望的元素相同，则执行相应的事件代码。

```javascript
// 1. 获取父元素
var parent = document.querySelector('ul')
// 2. 父元素绑定事件
parent.addEventListener('click', function (event) {
    // 3. 获取事件对象
    var event = EventUtil.getEvent(event)
    // 4. 获取目标元素
    var target = EventUtil.getTarget(event)
    // 5. 判断当前事件流所处的元素
    if (target.nodeName.toLowerCase() === 'li') {
          // 6. 与目标元素相同，做对应的处理
        console.log(target.innerText)
    }
});
```

事件绑定在父元素 `ul` 上，不管子元素 `li` 有多少个，也不会影响到页面中事件处理程序的个数，因此可以极大地提高浏览器的性能。

在上面的场景中，同一个 `ul` 下的所有 `li` 所做的操作都是一样的，使用事件委托即可处理。那么如果针对不同的元素所做的处理不一样，事件委托能否处理呢？答案当然是可以的，假定场景：在页面上有 4 个 `button` 按钮，分别表示增加、删除、修改、查询 4 个功能。每个按钮绑定相同的 `click` 事件处理程序，但是具体的行为不同。在这 4 个按钮触发 `click` 事件后，分别输出“新增”、“删除”、“修改”、“查询”等文字。

```html
<div id="box">
    <input type="button" id="add" value="新增" />
    <input type="button" id="remove" value="删除" />
    <input type="button" id="update" value="修改" />
    <input type="button" id="search" value="查询" />
</div>

<script>
	// 1. 获取父元素，并绑定事件处理程序
    var parent = document.querySelector('#parent')
    parent.addEventListener('click', function (event) {
        // 2. 获取 event 和 target
        var event = EventUtil.getEvent(event)
        var target = EventUtil.getTarget(event)
        // 3.判断 id 属性，输出对应的文字
        switch (target.id) {
            case 'add':
                console.log('新增')
                break
            case 'remove':
                console.log('删除')
                break
            case 'update':
                console.log('修改')
                break
            case 'search':
                console.log('查询')
                break
        }
	})
</script>
```

#### 7.2 新创建元素的事件绑定

场景：假如页面上有一个 `ul` 标签，里面包含 9 个 `li` 子标签，需要在单击每个 `li` 时，输出 `li` 中的文本内容；在页面上有一个 `button` 按钮，单击 `button` 按钮会创建一个新的 `li` 元素，单击新创建的 `li` 元素，输出它的文本内容。

1.   手动绑定方法：

     ```html
     <ul>
         <li>文本1</li>
         <li>文本2</li>
         <li>文本3</li>
         <li>文本4</li>
         <li>文本5</li>
         <li>文本6</li>
         <li>文本7</li>
         <li>文本8</li>
         <li>文本9</li>
     </ul>
     <button id="add">新增</button>
     
     <script>
         // 1. 获取所有的 li 标签
         var children = document.querySelectorAll('li')
         // 2.遍历添加 click 事件处理程序
         for (var i = 0; i < children.length; i++) {
             children[i].addEventListener('click', function () {
                 console.log(this.innerText)
             });
         }
         
         var ul = document.querySelector('ul')
         var add = document.querySelector('#add')
         add.addEventListener('click', function () {
             // 创建新的 li 元素
             var newLi = document.createElement('li')
             var newText = document.createTextNode('文本10')
             newLi.appendChild(newText)
             // 添加至父元素 ul 中
             ul.appendChild(newLi)
         });
     </script>
     ```

     单击按钮时，页面会新增内容为 `"文本10"` 的 `li` 元素，点击这个元素时，控制台不会有输出。这是因为前面说过，通过 `querySelectorAll()` 函数获取到的 `li` 元素**既不会实时感知到数量的变化，也不会实时增加对事件的绑定**。如果需要新元素也具有相同的事件，则需要手动调用事件绑定的代码。

     解决方式是将遍历添加 `click` 事件处理程序代码封装成一个函数，在添加完新元素后，重新调用一次这个封装的函数

     ```javascript
     // 遍历添加 click 事件处理程序
     function bindEvent() {
         for (var i = 0; i < children.length; i++) {
             children[i].addEventListener('click', function () {
                 console.log(this.innerText)
             })
         }
     }
     
     add.addEventListener('click', function () {
         var newLi = document.createElement('li')
         var newText = document.createTextNode('文本10')
         newLi.appendChild(newText)
         ul.appendChild(newLi)
         // 重新添加事件处理程序
         bindEvent()
     })
     ```

     这样，每次在新增一个元素后都需要手动绑定事件处理程序，不但操作烦琐，而且随着绑定的事件处理程序越来越多，性能也将受到影响。

2.   事件委托方法

     ```html
     <script>
         // 1. 获取父元素
         var parent = document.querySelector('ul')
         // 2. 父元素绑定事件
         parent.addEventListener('click', function (event) {
             // 3. 获取事件对象
             var event = EventUtil.getEvent(event)
             // 4. 获取目标元素
             var target = EventUtil.getTarget(event)
             // 5. 判断当前事件流所处的元素
             if (target.nodeName.toLowerCase() === 'li') {
                 // 6. 与目标元素相同，做对应的处理
                 console.log(target.innerText)
             }
         })
     
     </script>
     ```

     新增按钮的方式与前面一致。

### 8. contextmenu 右键事件

在 JavaScript 中有一系列常用的事件类型，总结如下：

-   焦点相关的 `focus`、`blur` 等事件
-   单击相关的 `click`、`dblclick`、`contextmenu` 等事件
-   鼠标相关的 `mouseover`、`mouseout`、`mouseenter` 等事件
-   键盘相关的 `keydown`、`keypress`、`keyup` 事件
-   拖曳相关的 `drag` 事件
-   移动端 `touch` 事件

Context Menu 是一个与用户进行友好交互的菜单，例如鼠标的右键产生的效果。如果需要定制化的鼠标右键效果，可以通过 `contextmenu` 事件来实现。

初始页面 HTML 代码如下：

```html
<ul class="tasks" id="tasks">
    <li class="task" data-id="1">
        <div class="task__content">ﬁrst content</div>
    </li>

    <li class="task" data-id="2">
        <div class="task__content">second content</div>
    </li>

    <li class="task" data-id="3">
        <div class="task__content">third content</div>
    </li>

    <li class="task" data-id="4">
        <div class="task__content">fourth content</div>
    </li>

    <li class="task" data-id="5">
        <div class="task__content">ﬁfth content</div>
    </li>
</ul>
```

右击出现的自定义菜单也是一段 HTML 代码，如下：

```html
<nav class="context-menu" id="context-menu">
    <ul class="context-menu__items">
        <li class="context-menu__item">
            <a href="#" class="context-menu__link" data-action="view">
                <i class="fa fa-eye m-r-5"></i>View Task
            </a>
        </li>
        <li class="context-menu__item">
            <a href="#" class="context-menu__link" data-action="edit">
                <i class="fa fa-edit m-r-5"></i>Edit Task
            </a>
        </li>
        <li class="context-menu__item">
            <a href="#" class="context-menu__link" data-action="delete">
                <i class="fa fa-times m-r-5"></i>Delete Task
            </a>
        </li>
    </ul>
</nav>
```

需要用到的变量和函数如下：

```javascript
// 自定义菜单元素
var menu = document.querySelector('#context-menu')
// 自定义菜单状态
var menuState = 0
// 自定义菜单显示样式
var active = 'context-menu--active'
// 自定义菜单位置对象
var menuPosition
// 自定义菜单水平位置
var menuPositionX
// 自定义菜单纵向位置
var menuPositionY
// 单击的li元素
var targetLi
// 初始化事件
function init() {
    // 给 li 元素添加右键事件
    contextListener()
    // 单击事件，单击后隐藏 menu
    clickListener()
    // keyup 事件，当按下 ESC 键时隐藏 menu
    keyupListener()
    // 菜单的单击事件
    menuListener()
}
```

通过事件委托，给 `li` 元素添加右键事件：

```javascript
function contextListener() {
    document.addEventListener('contextmenu', function (e) {
        if (clickInContextLister(e)) {
            e.preventDefault()
            targetLi = e.target
            // 显示自定义菜单
            toggleMenuOn()
            // 定位自定义菜单的位置
            positionMenu(e)
        } else {
            targetLi = null
            // 隐藏自定义菜单
            toggleMenuOff()
        }
    })
}
```

判断单击位置是否位于 `li` 元素内部：

```javascript
function clickInContextLister(e) {
    var target = e.target || e.srcElement
    while (target) {
        if (target.nodeName.toUpperCase() === 'LI') {
            return true
        }
        // 往上追溯父元素
        target = target.parentNode
    }
    return false
}
```

单击后隐藏自定义菜单：

```javascript
function clickListener() {
    document.addEventListener('click', function (e) {
        // 监听鼠标按键，左键是1，滚轮是2，右键是3
        var code = e.which || e.button
        if (code === 1) {
            // 隐藏自定义菜单
            toggleMenuOﬀ()
        }
    })
}
```

按下 ESC 键时隐藏自定义菜单：

```javascript
function keyupListener() {
    window.addEventListener('keyup', function (e) {
        if (e.keyCode === 27) {
            // 隐藏自定义菜单
            toggleMenuOﬀ()
        }
    })
}
```

右击出现菜单后，单击自定义菜单选项事件：

```javascript
function menuListener() {
    menu.addEventListener('click', function (e) {
        if (e.target.nodeName.toUpperCase() === 'A') {
            var result = 'the operation is:' + e.target.dataset.action + '\n' +
                'the id is:' + targetLi.dataset.id
            alert(result)
        }
    })
}
```

显示自定义菜单：

```javascript
function toggleMenuOn() {
    if (menuState !== 1) {
        menuState = 1
        menu.classList.add(active)
    }
}
```

隐藏自定义菜单：

```javascript
function toggleMenuOff() {
    if (menuState !== 0) {
        menuState = 0
        menu.classList.remove(active)
    }
}
```

根据事件触发的位置返回具体的坐标点：

```javascript
function getPosition(e) {
    var posx = 0
    var posy = 0

    if (!e) var e = window.event
    if (e.pageX || e.pageY) {
        posx = e.pageX
        posy = e.pageY
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.
        scrollLeft
        posy = e.clientY + document.body.scrollTop + document.documentElement.
        scrollTop
    }

    return {
        x: posx,
        y: posy
    }
}
```

确定自定义菜单出现的位置：

```javascript
function positionMenu(e) {
    menuPosition = getPosition(e)
    menuPositionX = menuPosition.x + 'px'
    menuPositionY = menuPosition.y + 'px'
    menu.style.left = menuPositionX
    menu.style.top = menuPositionY
}
```

### 9. 文档加载完成事件

在实际开发中，我们经常会遇到这样的场景：在页面初始化的时候去执行特定的操作，例如一个电商网站页面，在用户登录进入首页后获取用户常买的商品列表。这个场景涉及页面初始化的操作。页面初始化的操作可以理解为文档加载完成后执行的操作，所以这一场景可以理解为文档加载完成后执行特定的事件。

在 DOM 中，文档加载完成有两个事件，一个是 `onload` 事件，在原生 JavaScript 和 jQuery 中均有实现；另一个是 jQuery 提供的 `ready` 事件。

-   `ready` 事件的触发表示文档结构已经加载完成，不包含图片、flash 等非文字媒体内容。
-   `onload` 事件的触发表示页面中包含的图片、flash等 所有元素都加载完成。

#### 9.1 load 事件

load 事件会在页面、脚本或者图片加载完成后触发，支持 `onload` 事件的标签有 `body`、`frame`、`frameset`、`iframe`、`img`、`link`、`script`。如果 load 事件用于页面初始化，则有两种实现方式。

第一种方式是在 `body` 标签上使用 `onload` 属性，类似于 `onclick` 属性的设置，其实就是 DOM0 级事件处理程序。

```html
<!-- 使用onload属性 -->
<body onload="bodyLoad()">
<script>
    function bodyLoad() {
        console.log('文档加载完成，执行onload方法')
    }
</script>
</body>
```

第二种方式是设置 `window` 对象的 `onload` 属性，属性值为一个函数。

```html
<script>
    window.onload = function () {
        console.log('文档加载完成，执行onload方法')
    }
</script>
```

>   在 load 事件的两种实现方式中，如果同时采用两种方式，则只有一种方式会生效（通常，第一种方式的优先级会高于第二种方式）。

load 事件主要是防止页面加载完毕之前就执行 JavaScript 代码导致报错或失效。

在 jQuery 中同样提供了对 load 事件的实现，即 `load()` 函数，其语法格式如下：

```javascript
$(window).load(function(){...})
```

`load()` 函数是 jQuery 绑定在 `window` 对象上的，而不是 `document` 对象上的，因此下面这种写法并不会生效。

```javascript
$(document).load(function(){...}) // 不会生效
```

jQuery 的 `load()` 函数具有的功能与原生 JavaScript 的 `onload()` 函数是一致的，而且相比于 `window.onload()` 函数还有两大优点：

-   可以同时绑定多个 `$(window).load()` 函数。假如页面加载完成后，需要同时触发多个操作，可以同时编写多个 `$(window).load()` 函数。

    ```javascript
    // 操作1
    $(window).load(function () {
        // do action1
    })
    // 操作2
    $(window).load(function () {
        // do action2
    })
    // 操作3
    $(window).load(function () {
        // do action3
    })
    ```

    >   `window.load()` 函数只能绑定一个事件处理程序。

    在 `body` 标签中使用 `onload` 属性可以达到这个目的，但写法不工整，不推荐使用。

    ```html
    <body onload="fn1(),fn2(),fn3()"></body>
    ```

-   使用 `$(window).load()` 函数可以将 JavaScript 代码与 HTML 代码进行分离，而设置 `body` 标签的 `onload` 属性不可以将两者进行完全隔离。一旦代码冗余在一起，后续的代码维护将会变得越来越困难。

但 load 事件并不是初始化完成最好的实现方案，试想一下，对于一个图片网站来说，如果需要等到所有的图片都加载完成再去执行相应的操作，这将会给用户带来一段很长的等待时间，因为图片的加载相比于普通的 HTML 元素会消耗更长的时间。一个更好的解决方案是使用 ready 事件。

#### 9.2 ready 事件

ready 事件不同于 load 事件，只需要等待文档结构加载完成就可以执行。针对一个图片网站，使用 ready 事件，只需要等待 HTML 中的所有的 `img` 标签加载完成就可以执行初始化操作，而不需要等到 `img` 标签的 `src` 属性完全加载出来。这样将节省很长的等待时间，对性能来说是一大提升。因此在很多场景中，我们更推荐在 ready 事件中做初始化处理。

需要注意的是，ready 事件并不是原生 JavaScript 所具有的，而是在 jQuery 中实现的，ready 事件挂载在 `document` 对象上。

```javascript
$(document).ready(function () {...})
```

因为 `ready()` 函数仅能用于当前文档，无须选择器，所以可以省略掉 `document` 而简写为如下代码：

```javascript
$().ready(function () {...})
```

又因为 `$` 默认的事件为 ready 事件，所以 `ready()` 函数也可以省略，从而更加精简，代码如下：

```javascript
$(function () {...})
```

#### 9.3 加载完成事件的执行顺序

页面加载完成一共有 6 种处理方式：

```javascript
// 第一种
$(document).ready(function () {...})
// 第二种
$().ready(function () {...})
// 第三种
$(function () {...})
// 第四种
$(window).load(function () {...})
// 第五种
window.onload = function () {...}
// 第六种
// <body onload="bodyLoad()"></body>
```

那么这 6 种方式的执行顺序呢？

事件的执行顺序会随着事件定义顺序的不同而不同。而事件的定义会写在 `script` 标签中，具体来说就是 `script` 标签所放的位置，一个是将 `script` 标签写在 `head` 标签中，一个是将 `script` 标签写在 `body` 标签中。

1.   将 `script` 标签写在 `head` 标签中

     ```html
     <!DOCTYPE html>
     <html>
     
         <head>
             <meta charset="UTF-8">
             <title>ready与load事件执行顺序</title>
             <script src="https://cdn.bootcdn.net/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
             <script>
                 // 方式1: $(document).ready()
                 $(document).ready(function () {
                     console.log('执行方式1: $(document).ready()')
                 })
     
                 // 方式2: $().ready()
                 $().ready(function () {
                     console.log('执行方式2: $().ready()')
                 })
     
                 // 方式3: $(function(){})
                 $(function () {
                     console.log('执行方式3: $(function(){})')
                 })
                 // 方式4: $(window).load()
                 $(window).load(function () {
                     console.log('执行方式4: $(window).load()')
                 })
                 // 方式5: window.onload
                 window.onload = function () {
                     console.log('执行方式5: window.onload')
                 }
                 // 方式6: body标签的onload属性
                 function bodyOnLoad() {
                     console.log('执行方式6: body标签的onload属性')
                 }
             </script>
         </head>
     
         <body onload="bodyOnLoad()">
         </body>
     
     </html>
     ```

     执行结果为：

     ```
     执行方式1: $(document).ready()
     执行方式2: $().ready()
     执行方式3: $(function(){})
     执行方式4: $(window).load()
     执行方式6: body标签的onload属性
     ```

     >   方式 5 被方式 6 覆盖，这与 `onclick` 事件相反。
     >
     >   另外，值得一提的是，上面的顺序是针对 2.2.0 版本的 jQuery 而言的，针对其他版本情况可能不同。

2.   将 `script` 标签写在 `body` 标签中

     ```html
     <!DOCTYPE html>
     <html>
     
         <head>
             <meta charset="UTF-8">
             <title>ready与load事件执行顺序</title>
         </head>
     
         <body onload="bodyOnLoad()">
             <script src="https://cdn.bootcdn.net/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
             <script>
                 // 方式1: $(document).ready()
                 $(document).ready(function () {
                     console.log('执行方式1: $(document).ready()')
                 })
     
                 // 方式2: $().ready()
                 $().ready(function () {
                     console.log('执行方式2: $().ready()')
                 })
     
                 // 方式3: $(function(){})
                 $(function () {
                     console.log('执行方式3: $(function(){})')
                 })
                 // 方式4: $(window).load()
                 $(window).load(function () {
                     console.log('执行方式4: $(window).load()')
                 })
                 // 方式5: window.onload
                 window.onload = function () {
                     console.log('执行方式5: window.onload')
                 }
                 // 方式6: body标签的onload属性
                 function bodyOnLoad() {
                     console.log('执行方式6: body标签的onload属性')
                 }
             </script>
         </body>
     
     </html>
     ```

     运行结果为：

     ```
     执行方式1: $(document).ready()
     执行方式2: $().ready()
     执行方式3: $(function(){})
     执行方式5: window.onload
     执行方式4: $(window).load()
     ```

总结如下：

1.   使用 jQuery 的 ready 事件总会比 load 事件先执行，jQuery 提供的 ready 事件的两种形式其实是等效的，定义在前面的会先执行。
2.   load 事件的执行顺序取决于方法定义中的位置，当将 `script` 标签写在 `body` 标签中时，`window.onload` 会比 jQuery 的 `load()` 函数先执行；当将 `script` 标签写在 `head` 标签中时，相反。

### 10. 浏览器重排和重绘

相比于 JavaScript 级别的操作，DOM 级别的操作是相当消耗性能的，而且对 DOM 的修改相比于对 DOM 的访问，在性能上的影响会更大，因为它会带来浏览器的**重排**或**重绘**。

浏览器渲染 HTML 的过程大致可以分为 4 步：

-   HTML 文件被 HTML 解析器解析成对应的 DOM 树，CSS 样式文件被 CSS 解析器解析生成对应的样式规则集，称为 CSSOM。

    ![](https://res.weread.qq.com/wrepub/epub_34232297_17)

-   DOM 树与 CSS 样式集解析完成后，附加在一起形成一个渲染树。

-   节点信息的计算，即根据渲染树计算每个节点的几何信息。

-   渲染绘制，即根据计算完成的节点信息绘制整个页面。

重排和重绘发生在第 3 步和第 4 步中。

#### 10.1 重排

浏览器渲染页面默认采用的是**流式布局模型**（从上到下、从左到右依次遍历元素）。对某一个 DOM 节点信息进行修改时，就需要对该 DOM 结构进行重新计算。该 DOM 结构的修改会决定周边 DOM 结构的更改范围，主要分为**全局范围**和**局部范围**。全局范围就是从页面的根节点 html 标签开始，对整个渲染树进行重新计算。例如，当我们改变窗口的尺寸或者修改了根元素的字体大小时，局部范围只会对渲染树的某部分进行重新计算。例如要改变页面中某个 div 的宽度，只需要重新计算渲染树中与该 div 相关的部分即可。而重排的过程就发生在 DOM 节点信息修改的时候，重排实际是根据渲染树中每个渲染对象的信息，计算出各自渲染对象的几何信息，如 DOM 元素的位置、尺寸、大小等，然后将其安置在界面中正确的位置。 

重排是一种明显的改变页面布局的操作，常见引起重排的操作有：

-   页面首次渲染

-   浏览器窗口大小发生改变

-   元素尺寸或位置发生改变

-   元素内容发生变化

-   元素字体发生变化

-   添加或删除可见的 DOM 元素

-   获取某些特定的属性

    有些时候，一些 JavaScript 代码会频繁引起重排的操作，而频繁的重排操作会对浏览器引擎产生很大的消耗。所以浏览器不会针对每个 JS 操作都进行一次重排，而是维护一个会引起重排操作的队列，等队列中的操作达到了一定的数量或者到了一定的时间间隔时，浏览器才会去 flush 一次队列，进行真正的重排操作。

    虽然浏览器会有这个优化，但有一些代码可能会强制浏览器提前 flush 队列，例如获取以下这些样式信息时：

    -   `width`：宽度
    -   `height`：高度
    -   `margin`：外边距
    -   `padding`：内边距
    -   `display`：元素显示方式
    -   `border`：边框
    -   `position`：元素定位方式
    -   `overflow`：元素溢出处理方式
    -   `clientWidth`：元素可视区宽度
    -   `clientHeight`：元素可视区高度
    -   `clientLeft`：元素边框宽度
    -   `clientTop`：元素边框高度
    -   `offsetWidth`：元素水平方向占据的宽度
    -   `offsetHeight`：元素水平方向占据的高度
    -   `offsetLeft`：元素左外边框至父元素左内边框的距离
    -   `offsetTop`：元素上外边框至父元素上内边框的距离
    -   `scrollWidth`：元素内容占据的宽度
    -   `scrollHeight`：元素内容占据的高度
    -   `scrollLeft`：元素横向滚动的距离
    -   `scrollTop`：元素纵向滚动的距离
    -   `scrollIntoView()`：元素滚动至可视区的函数
    -   `scrollTo()`：元素滚动至指定坐标的函数
    -   `getComputedStyle()`：获取元素的 CSS 样式的函数
    -   `getBoundingClientRect()`：获取元素相对于视窗的位置集合的函数
    -   `scrollIntoViewIfNeeded()`：元素滚动至浏览器窗口可视区的函数（非标准特性，谨慎使用）

    当我们请求以上这些属性时，浏览器为了返回最精准的信息，需要 flush 队列，因为队列中的某些操作可能会影响到某些值的获取。因此，即使你获取的样式信息与队列中的操作无关，浏览器仍然会强制 flush 队列，从而引起浏览器重排的操作。

#### 10.2 重绘

相比于重排，重绘简单很多。**重绘只是改变元素在页面中的展现样式，而不会引起元素在文档流中位置的改变**。例如更改了元素的字体颜色、背景色、透明度等，浏览器均会将这些新样式赋予元素并重新绘制。

修改下面的属性会引起重绘：

-   `color`：颜色
-   `border-style`：边框样式
-   `visibility`：元素是否可见
-   `background`：元素背景样式，包括背景色、背景图、背景图尺寸、背景图位置等
-   `text-decoration`：文本装饰，包括文本加下划线、上划线、贯穿线等
-   `outline`：元素的外轮廓的样式，在边框外的位置
-   `border-radius`：边框圆角
-   `box-shadow`：元素的阴影

**重排一定会引起重绘的操作，而重绘却不一定会引起重排的操作**。因为在元素重排的过程中，元素的位置等几何信息会重新计算，并会引起元素的重新渲染，这就会产生重绘的操作。而在重绘时，只是改变了元素的展现样式，而不会引起元素在文档流中位置的改变，所以并不会引起重排的操作。

#### 10.3 性能优化

浏览器的重排与重绘是比较消耗性能的操作，因此要极力避免重排，减少重绘。常见的方法有：

-   将多次改变样式的属性操作合并为一次

    ```js
    var changeDiv = document.querySelector('#changeDiv')
    changeDiv.style.width = '100px'
    changeDiv.style.background = '#e3e3e3'
    changeDiv.style.height = '100px'
    changeDiv.style.marginTop = '10px'
    ```

    上面的操作多次修改了 `style` 属性，会引发多次重排与重绘的操作，可以将这些 CSS 属性合并为一个 class 类：

    ```css
    .changeDiv {
        width: '100px';
        background: #e3e3e3;
        height: 100px;
        margin-top: 10px;
    }
    ```

    然后通过 JavaScript 直接修改元素的 class 类：

    ```js
    document.getElementById('changeDiv').className = 'changeDiv'
    ```

-   将需要多次重排的元素设置为绝对定位

    需要进行重排的元素都是处于正常的文档流中的，如果这个元素不处于文档流中，那么它的变化就不会影响到其他元素的变化，这样就不会引起重排的操作。常见的操作就是设置其 `position` 为 `absolute` 或者 `fixed`。

-   在内存中多次操作节点，完成后再添加至文档树中

    假设有需求：通过异步请求获取表格的数据后，将其渲染到页面上。这个需求可以有两种实现方式，一种是每次构造一行数据的 HTML 片段，分多次添加到文档树中：

    ```js
    // 将数据渲染至 table
    function renderTable(list) {
        // 目标 table 元素
        var table = $('#table')
        var rowHTML = ''
        // 遍历数据集
        list.forEach(function(item) {
            rowHTML += '<tr>'
            rowHTML += '<td>' + item.name + '</td>'
            rowHTML += '<td>' + item.address + '</td>'
            rowHTML += '<td>' + item.email + '</td>'
            rowHTML += '</tr>'
            // 每次添加一行数据
            table.append($(rowHTML))
            // 添加完后清空
            rowHTML = ''
        });
    }
    ```

    另一种是先在内存中构建出完整的 HTML 片段，再一次性添加到文档树中：

    ```js
    // 将数据渲染至 table
    function renderTable(list) {
        // 目标 table 元素
        var table = $('#table')
        var allHTML = ''
        // 遍历数据集
        list.forEach(function(item) {
            allHTML += '<tr>'
            allHTML += '<td>' + item.name + '</td>'
            allHTML += '<td>' + item.address + '</td>'
            allHTML += '<td>' + item.email + '</td>'
            allHTML += '</tr>'
        });
        // 获取完整片段后,一次性渲染
        table.append($(allHTML))
    }
    ```

    方法 1 会引起多次重排和重绘，而方法 2 只引起一次，性能更好。

-   将要进行复杂处理的元素处理为 `display` 属性为 `none`，处理完成后再进行显示

    因为 `display` 属性为 `none` 的元素不会出现在渲染树中，所以对其进行处理并不会引起其他元素的重排。当需要对一个元素做复杂处理时，可以将其 `display` 属性设置为 `none`，操作完成后，再将其显示出来，这样就只会在隐藏和显示的时候引发两次重排操作。

-   将频繁获取会引起重排的属性缓存至变量

    ![](http://emlog-source.gopher.fit/upload/7NhEo320230616142943.png)

-   尽量减少使用 table 布局

    如果 table 中任何一个元素触发了重排的操作，那么整个 table 都会触发重排的操作，尤其是当一个 table 内容比较庞大时，更加不推荐使用 table 布局。

    如果不得已使用了 table，可以设置 `table-layout: auto` 或者是 `table-layout: fixed`。这样可以让 table 一行一行地渲染，这种做法也是为了限制重排的影响范围。

-   使用事件委托绑定事件处理程序

-   利用 DocumentFragment 操作 DOM 节点

    DocumentFragment 是一个没有父级节点的最小文档对象，它可以用于存储已经排好版或者尚未确定格式的 HTML 片段。

    **DocumentFragment 最核心的知识点在于它不是真实DOM树的一部分，它的变化不会引起 DOM 树重新渲染的操作，也就不会引起浏览器重排和重绘的操作，从而带来性能上的提升**。

    因为 DocumentFragment 具有的特性，在需要频繁进行 DOM 新增或者删除的操作中，它将变得非常有用。一般的操作方法分为以下两步：

    -   将需要变更的 DOM 元素放置在一个新建的 DocumentFragment 中，因为 DocumentFragment 不存在于真实的 DOM 树中，所以这一步操作不会带来任何性能影响。
    -   将 DocumentFragment 添加至真正的文档树中，这一步操作处理的不是 DocumentFragment 自身，而是 DocumentFragment 的全部子节点。对 DocumentFragment 的操作来说，只会产生一次浏览器重排和重绘的操作，相比于频繁操作真实 DOM 元素的方法，会有很大的性能提升。

    例如，往页面的 `ul` 元素中添加 100 个 `li` 元素，有两种实现方法，一种是通过 `createElement()` 函数来实现，另一种是通过 `createDocumentFragment()` 函数来实现。

    -   `createElement()` 函数

        ```html
        <ul id="list"></ul>
        <script>
            var list = document.querySelector('#list')
            for (var i = 0; i < 100; i++) {
                var li = document.createElement('li')
                var text = document.createTextNode('节点' + i)
                li.append(text)
                list.append(li) // 引起重排
            }
        </script>
        ```

    -   `createDocumentFragment()` 函数

        ```html
        <script>
            var list = document.querySelector('#list2')
            // 1.创建新的 DocumentFragment 对象
            var fragment = document.createDocumentFragment()
            for (var i = 0; i < 100; i++) {
                var li = document.createElement('li')
                var text = document.createTextNode('节点' + i)
                li.append(text)
                // 2.将新增的元素添加至 DocumentFragment 对象中
                fragment.append(li)
            }
            // 3.处理 DocumentFragment 对象
            list.append(fragment) // 仅产生一次重排
        </script>
        ```

        
