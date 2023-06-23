![](http://emlog-source.gopher.fit/upload/7N2o4420230510195358.png)

### 1. JavaScript的组成

完整的 JavaScript 包含三个部分：

-   核心（ECMAScript）
-   文档对象模型（DOM）
-   浏览器对象模型（BOM）

### 2.ECMAScript的符合性

>   即要成为 ECMAScript 实现必须满足的条件

-   支持 ECMA-262 中描述的所有类型、值、对象、属性、函数，以及程序语法与语义
-   支持 Unicode 字符标准
-   增加 ECMA-262 中未提及的额外的类型、值、对象、属性和函数。
-   支持 ECMA-262 中没有定义的“程序和正则表达式语法”（意思是允许修改和扩展内置的正则表达式特性）

### 3. `<script>`元素

将 JavaScript 插入 HTML 的主要方法是使用 `<script>`元素。

`<script>` 元素有 8 个属性：

-   `async`：
    -   可选
    -   表示应该立即开始下载脚本，但不能阻止其他页面动作，如下载资源或等待其他脚本加载
    -   只对外部脚本文件有效

-   `charset`：
    -   可选
    -   使用 `src` 属性指定的代码字符集
    -   很少使用，大多数浏览器不在乎它的取值

-   `crossorigin`：
    -   可选
    -   配置相关请求的 CORS（跨源资源共享）设置，默认不开启
    -   `crossorigin="anonymous"` 配置文件请求不必设置凭据标志
    -   `crossorigin="use-credentials"` 设置凭据标志，意味着出站请求会包含凭据

-   `defer`：
    -   可选
    -   表示脚本可以延迟到文档完全被解析和显示之后再执行
    -   只对外部脚本文件有效

-   `integrity`：
    -   可选
    -   允许比对接收到的资源和指定的加密签名以验证子资源完整性（SRI），如不匹配，则报错，脚本不会执行
    -   可以用于确保**内容分发网络**（CDN, Content Delivery Network）不会提供恶意内容

-   `language`：废弃，不应该再使用
-   `src`：
    -   可选
    -   表示包含要执行的代码的外部文件

-   `type`：
    -   可选
    -   代替 `language`，表示代码块中脚本语言的内容类型（即 MIME 类型）。
    -   按照惯例，这个值始终都是 `"text/javascript"`，尽管 `"text/javascript"` 已经废弃了
    -   JavaScript 文件的 MIME 类型通常是 `"application/x-javascript"`，不过给 `type` 属性这个值有可能导致脚本被忽略。
    -   在非 IE 的浏览器中有效的其他值还有`"application/javascript"` 和`"application/ecmascript"`。
    -   如果这个值是 `module`，则代码会被当成 ES6 模块，而且只有这时候代码中才能出现 `import` 和 `export` 关键字。


使用 `<script>` 的方式有两种：通过它直接在网页中嵌入 JavaScript 代码，以及通过它在网页中包含外部 JavaScript 文件。

要嵌入行内 JavaScript 代码，直接把代码放在 `<script>` 元素中即可：

```html
<script>
	function sayHi() {
        console.log("Hi!");
    }
</script>
```

在 `<script>` 元素中的代码被计算完成之前，页面的其余内容不会被加载，也不会被显示（**JS 代码的执行会阻塞**）。

在使用行内 JavaScript 代码时，要注意代码中不能出现字符串 `</script>`，因为浏览器会将它解释为标签的结束，可以通过转义字符或者字符串拼接来避免，如：

```html
<script>
	function sayScript() {
        console.log("<\/script>");
    }
</script>
```

要包含外部文件中的 JavaScript，就必须使用 `src` 属性。这个属性的值是一个 URL，指向包含 JavaScript 代码的文件，如：

```html
<script src="example.js"></script>
```

与解释行内 JavaScript 一样，在解释外部 JavaScript 文件时，页面也会阻塞。（阻塞时间也包含下载文件的时间。）在 XHTML 文档中，可以忽略结束标签，如：

```html
<script src="example.js" />
```

但这种语法不能在 HTML 中使用。

>   按照惯例，外部 JavaScript 文件的扩展名是 `.js`。这不是必需的，因为浏览器不会检查所包含 JavaScript 文件的扩展名。这就为使用服务器端脚本语言动态生成 JavaScript 代码，或者在浏览器中将 JavaScript 扩展语言（如 TypeScript，或 React 的 JSX）转译为 JavaScript 提供了可能性。不过要注意，服务器经常会根据文件扩展来确定响应的正确 MIME 类型。如果不打算使用 `.js` 扩展名，一定要确保服务器能返回正确的 MIME 类型。

使用了 `src` 属性的 `<script>` 元素不应该再在标签中再包含其他 JavaScript 代码。如果两者都提供的话，则浏览器只会下载并执行脚本文件，从而忽略行内代码。

`<script>` 元素的 `src` 属性可以是一个完整的 URL，而且这个 URL 指向的资源可以跟包含它的 HTML 页面不在同一个域中，如：

```html
<script src="http://www.somewhere.com/afile.js"></script>
```

不过，引用别人服务器上的 JavaScript 要格外小心，避免恶意程序，`<script>` 标签的 `integrity` 属性是防范这种问题的一个武器，但不是所有浏览器都支持。

浏览器会按照 `<script>` 在页面中出现的顺序依次解释它们，前提是没有使用 `defer` 和 `async` 属性。第二个 `<script>` 元素的代码必须在第一个 `<script>` 元素的代码解释完毕才能开始解释，以此类推。

### 4. 标签位置

过去，`<script>` 都被放在页面的 `<head>` 标签内，主要目的是把外部的 CSS 和 JavaScript 文件都集中放到一起。不过，把所有 JavaScript 文件都放在 `<head>` 里，就意味着必须把所有 JavaScript 代码都下载、解析和解释完成后，才能开始渲染页面（页面在浏览器解析到 `<body>` 的起始标签时开始渲染）。对于需要很多 JavaScript 的页面，这会导致页面渲染的明显延迟，在此期间浏览器窗口完全空白。为解决这个问题，现代 Web 应用程序通常将所有 JavaScript 引用放在 `<body>` 元素中的页面内容后面。这样一来，页面会在处理 JavaScript 代码之前完全渲染页面。用户会感觉页面加载更快了，因为浏览器显示空白页面的时间短了。

### 5. 推迟执行脚本

`<script>` 标签有一个 `defer` 的属性，表示脚本在执行的时候不会改变页面的结构，即脚本会被延迟到整个页面都解析完毕后再运行。因此，在 `<script>` 元素上设置 `defer` 属性，相当于告诉浏览器**立即下载，但延迟执行**。

```html
<! DOCTYPE html>
<html>
    <head>
        <title>Example HTML Page</title>
        <script defer src="example1.js"></script>
        <script defer src="example2.js"></script>
    </head>
    <body>
        <!-- 页面内容 -->
    </body>
</html>
```

虽然 `<script>` 元素包含在页面的 `<head>` 中，但它们会在浏览器解析到结束的 `</html>` 标签后才会执行。HTML5 规范要求脚本应该按照它们出现的顺序执行，因此第一个推迟的脚本会在第二个推迟的脚本之前执行，而且两者都会在 DOMContentLoaded 事件之前执行。不过在实际当中，推迟执行的脚本不一定总会按顺序执行或者在 DOMContentLoaded 事件之前执行，因此最好只包含一个这样的脚本。

`defer` 属性只对外部脚本文件才有效，浏览器会忽略行内脚本的 `defer` 属性，按照通常的做法来处理脚本。考虑到这一点，还是把要推迟执行的脚本放在页面底部比较好。

>   对于 XHTML 文档，指定 `defer` 属性时应该写成 `defer="defer"`。

### 6. 异步执行脚本

`<script>` 标签定义了 `async` 属性。从改变脚本处理方式上看，`async` 属性与 `defer` 类似，都只适用于外部脚本，都会告诉浏览器立即开始下载。但标记为 `async` 的脚本并不保证能按照它们出现的次序执行，如：

```html
<! DOCTYPE html>
<html>
    <head>
        <title>Example HTML Page</title>
        <script async src="example1.js"></script>
        <script async src="example2.js"></script>
    </head>
    <body>
        <!-- 页面内容 -->
    </body>
</html>
```

第二个脚本可能先于第一个脚本执行，重点在于它们之间没有依赖关系。给脚本添加 `async` 属性的目的是告诉浏览器，不必等脚本下载和执行完后再加载页面，同样也不必等到该异步脚本下载和执行后再加载其他脚本。正因为如此，异步脚本不应该在加载期间修改 DOM 。异步脚本保证会在页面的 load 事件前执行，但可能会在 DOMContentLoaded 之前或之后。一般不推荐使用这个属性。

>   对于 XHTML 文档，指定 `async` 属性时应该写成 `async="async"`。

#### 7. 动态加载脚本

除了 `<script>` 标签，还有其他方式可以加载脚本。因为 JavaScript 可以使用 DOM API，所以通过向 DOM 中动态添加 script 元素同样可以加载指定的脚本。只要创建一个 script 元素并将其添加到 DOM 即可。

```javascript
let script = document.createElement('script');
script.src = 'example.js';
document.head.appendChild(script);
```

默认情况下，以这种方式创建的 `<script>` 元素是以异步方式加载的，相当于添加了 `async` 属性。所有浏览器都支持 `createElement()` 方法，但不是所有浏览器都支持 `async` 属性。因此，如果要统一动态脚本的加载行为，可以明确将其设置为同步加载：

```javascript
let script = document.createElement('script');
script.src = 'example.js';
script.async = false; // 设置同步
document.head.appendChild(script);
```

以这种方式获取的资源对浏览器预加载器是不可见的。这会严重影响它们在资源获取队列中的优先级，严重影响性能。要想让预加载器知道这些动态请求文件的存在，可以在文档头部显式声明它们：

```html
<link rel="preload" href="gibberish.js">
```

### 7. XHTML

可扩展超文本标记语言（XHTML, Extensible HyperText Markup Language）是将 HTML 作为 XML 的应用重新包装的结果。与 HTML 不同，在 XHTML 中使用 JavaScript 需指定 `type` 属性且值为 `"text/javascript"`，HTML 中则可以没有这个属性。

XHTML 虽然已经退出历史舞台，但实践中偶尔可能也会遇到遗留代码。

在 XHTML 中编写代码的规则比 HTML 中严格，会影响使用 `<script>` 元素嵌入 JavaScript 代码。下面的代码块虽然在 HTML 中有效，但在 XHML 中是无效的。

```html
<script type="text/javascript">
	function compare(a, b) {
        if (a < b) {
            console.log("A is less than B");
        } else if (a > b) {
             console.log("A is greater than B");
        } else {
             console.log("A is equal to B");
        }
    }
</script>
```

在 HTML 中，解析 `<script>` 元素会应用特殊规则。XHTML 中则没有这些规则。这意味着 `a < b` 语句中的 `<` 会被解释成一个标签的开始，并且由于作为标签开始的小于号后面不能有空格，这会导致语法错误。

避免 XHTML 中这种语法错误的方法有两种。

第一种是把所有 `<` 都替换成对应的 HTML 实体形式 `&lt;`。

```html
<script type="text/javascript">
	function compare(a, b) {
        if (a &lt; b) {
            console.log("A is less than B");
        } else if (a > b) {
             console.log("A is greater than B");
        } else {
             console.log("A is equal to B");
        }
    }
</script>
```

第二种方法是把所有代码都包含到一个 CDATA 块中。在 XHTML（及XML）中，CDATA 块表示文档中可以包含任意文本的区块，其内容不作为标签来解析，因此可以在其中包含任意字符，包括小于号，并且不会引发语法错误。使用 CDATA 的格式如下：

```html
<script type="text/javascript"><![CDATA[
	function compare(a, b) {
        if (a < b) {
            console.log("A is less than B");
        } else if (a > b) {
             console.log("A is greater than B");
        } else {
             console.log("A is equal to B");
        }
    }
]]></script>
```

在兼容 XHTML 的浏览器中，这样能解决问题。但在不支持 CDATA 块的非 XHTML 兼容浏览器中则不行。为此，CDATA 标记必须使用 JavaScript 注释来抵消：

```html
<script type="text/javascript">
    // <![CDATA[
	function compare(a, b) {
        if (a < b) {
            console.log("A is less than B");
        } else if (a > b) {
             console.log("A is greater than B");
        } else {
             console.log("A is equal to B");
        }
    }
	// ]]>
</script>
```

这种格式适用于所有现代浏览器，可以通过 XHTML 验证，而且对 XHTML 之前的浏览器也能优雅地降级。

>   XHTML 模式会在页面的 MIME 类型被指定为 `"application/xhtml+xml"` 时触发。并不是所有浏览器都支持以这种方式送达的 XHTML。

### 8. 废弃的语法

`type` 属性使用一个 MIME 类型字符串来标识 `<script>` 的内容，但 MIME 类型并没有跨浏览器标准化。即使浏览器默认使用 JavaScript，在某些情况下某个无效或无法识别的 MIME 类型也可能导致浏览器跳过（不执行）相关代码。因此，除非你使用 XHTML 或 `<script>` 标签要求或包含非 JavaScript 代码，最佳做法是不指定 `type` 属性。

对 `script` 标签需应用特殊的解析规则，这在不支持 JavaScript 的浏览器（尤其是 Mosaic）中会导致问题。不支持的浏览器会把 `<script>` 元素的内容输出到页面上，从而破坏页面的外观。Netscape 联合 Mosaic 拿出了一个解决方案，对不支持 JavaScript 的浏览器隐藏嵌入的 JavaScript 代码。最终方案是把脚本代码包含在一个 HTML 注释中，如：

```html
<script>
	<!--
    function sayHi() {
        console.log("Hi!");
    }
    // -->
</script>
```

使用这种格式，Mosaic 等浏览器就可以忽略 `<script>` 标签中的内容，而支持 JavaScript 的浏览器则必须识别这种模式，将其中的内容作为 JavaScript 来解析。

虽然这种格式仍然可以被所有浏览器识别和解析，但已经不再必要，而且不应该再使用了。在 XHTML 模式下，这种格式也会导致脚本被忽略，因为代码处于有效的 XML 注释当中。

### 9. 行内代码和外部文件

虽然可以直接在 HTML 文件中嵌入 JavaScript 代码，但通常认为最佳实践是将 JavaScript 代码放在外部文件中，理由如下：

-   **可维护性**；JavaScript 代码如果分散到很多 HTML 页面，会导致维护困难。而用一个目录保存所有 JavaScript 文件，则更容易维护。
-   **缓存**；浏览器会根据特定的设置缓存所有外部链接的 JavaScript 文件，这意味着如果两个页面都用到同一个文件，则该文件只需下载一次。这最终意味着页面加载更快。
-   **适应未来**；通过把 JavaScript 放到外部文件中，就不必考虑 XHTML 的兼容性，外部 JavaScript 文件的语法在 HTML 和 XHTML 中是一样的。

在配置浏览器请求外部文件时，要重点考虑的一点是它们会占用多少带宽。在 SPDY/HTTP2 中，预请求的消耗已显著降低，以轻量、独立 JavaScript 组件形式向客户端送达脚本更具优势。如一个页面包含如下脚本：

```html
<script src="mainA.js"></script>
<script src="component1.js"></script>
<script src="component2.js"></script>
<script src="component3.js"></script>
...
```

后续页面可能包含如下脚本：

```html
<script src="mainB.js"></script>
<script src="component3.js"></script>
<script src="component4.js"></script>
<script src="component5.js"></script>
...
```

在初次请求时，如果浏览器支持 SPDY/HTTP2，就可以从同一个地方取得一批文件，并将它们逐个放到浏览器缓存中。从浏览器角度看，通过 SPDY/HTTP2 获取所有这些独立的资源与获取一个大 JavaScript 文件的延迟差不多。在第二个页面请求时，由于你已经把应用程序切割成了轻量可缓存的文件，第二个页面也依赖的某些组件此时已经存在于浏览器缓存中了。当然，这里假设浏览器支持 SPDY/HTTP2，只有比较新的浏览器才满足。如果你还想支持那些比较老的浏览器，可能还是用一个大文件更合适。

### 10. 文档模式

最初的文档模式有两种：**混杂模式**（quirks mode）和**标准模式**（standards mode）。前者使浏览器支持一些非标准的特性，后者让浏览器具有兼容标准的行为。虽然这两种模式的主要区别只体现在通过 CSS 渲染的内容方面，但对 JavaScript 也有一些关联影响，或称为**副作用**。

随着浏览器的普遍实现，又出现了第三种文档模式：**准标准模式**（almost standards mode）。这种模式下的浏览器支持很多标准的特性，但是没有标准规定得那么严格。主要区别在于如何对待图片元素周围的空白（在表格中使用图片时最明显）。混杂模式在浏览器中以省略文档开头的 `doctype` 声明作为开关。因为混杂模式在不同浏览器中的差异非常大，故不建议使用。

标准模式通过下列几种文档类型声明开启：

```html
<!-- HTML 4.01 Strict -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<!-- XHTML 1.0 Strict -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<!-- HTML5-->
<!DOCTYPE html>
```

准标准模式通过过渡性文档类型（Transitional）和框架集文档类型（Frameset）来触发：

```html
<!-- HTML 4.01 Transitional -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<!-- HTML 4.01 Frameset -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">

<!-- XHTML 1.0 Transitional -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!-- XHTML 1.0 Frameset -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

准标准模式与标准模式非常接近，很少需要区分。人们在说到“标准模式”时，可能指其中任何一个。

### 11. `<noscript>`标签

针对早期浏览器不支持 JavaScript 的问题，出现了 `<noscript>` 标签，被用于给不支持 JavaScript 的浏览器提供替代内容。虽然如今的浏览器已经 100% 支持 JavaScript ，但对于禁用 JavaScript 的浏览器来说，这个元素仍然有用。

`<noscript>` 元素可以包含任何可以出现在 `<body>` 中的 HTML 元素，`<script>` 除外。

在下列两种情况下，浏览器将显示包含在 `<noscript>` 中的内容：

-   浏览器不支持脚本
-   浏览器对脚本的支持被关闭

任何一个条件被满足，包含在 `<noscript>` 中的内容就会被渲染。否则，浏览器不会渲染 `<noscript>` 中的内容。

```html
<! DOCTYPE html>
<html>
	<head>
		<title>Example HTML Page</title>
		<script defer="defer" src="example1.js"></script>
		<script defer="defer" src="example2.js"></script>
	</head>
	<body>
		<noscript>
			<p>This page requires a JavaScript-enabled browser.</p>
		</noscript>
	</body>
</html>
```

这个例子是在脚本不可用时让浏览器显示一段话。如果浏览器支持脚本，则用户永远不会看到它。
