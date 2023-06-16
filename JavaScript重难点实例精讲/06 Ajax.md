Ajax 是目前最流行的前后端数据交互的方式之一，通过异步请求就可以在不需要刷新页面的情况下，达到局部刷新的效果。

Ajax 并非是一种全新的技术，而是由以下技术组合而成：

-   使用 CSS 和 XHTML 做页面呈现
-   使用 DOM 进行交互和动态显示
-   使用 XMLHttpRequest 对象和服务器进行异步通信
-   使用 JavaScript 进行绑定和调用，操作DOM

在上面涉及的几种技术中，除 XMLHttpRequest 外，其余几种都是基于 Web 标准并得到了广泛使用。

### 1. Ajax 的基本原理及执行过程

Ajax 的基本原理是通过 XMLHttpRequest 对象向服务器发送异步请求，获取服务器返回的数据后，利用 DOM 的操作来更新页面。

<img src="http://emlog-source.gopher.fit/upload/7Nm9hc20230615213526.png" alt="image-20230306000404342" style="zoom:67%;" />

其中最核心的部分就是 XMLHttpRequest 对象，它是一个 JavaScript 对象，支持异步请求，可以及时向服务器发送请求和处理响应，并且不阻塞用户，达到不刷新页面的效果。

#### 1.1 XMLHttpRequest 对象

XMLHttpRequest 对象从创建到销毁存在一个完整的生命周期，在生命周期的每个阶段会调用 XMLHttpRequest 对象的不同函数，在函数中需要通过该对象的特定属性来判断函数执行情况。

1.   XMLHttpRequest 对象的函数

     -   `abort()` 函数

         如果请求已经发送，则停止当前请求

     -   `getAllResponseHeaders()` 函数

         获取所有 HTTP 请求的响应头部，作为键值对返回；如果没有收到响应，则返回 `null`

     -   `getResponseHeader("key")` 函数

         获取指定 `key` 的 HTTP 响应头，如果没有收到响应或者响应中不存在 `key` 对应的报头，则返回 `null`

     -   `open("method","URL",[asyncFlag],["userName"],["password"])` 函数

         建立对服务器的调用

         -   `method` 为请求方式，可为 `GET`、`POST` 或 `PUT`
         -   `URL` 为请求路径，可以是相对或绝对路径
         -   后面 3 个是可选参数，分别表示是否异步、用户名、密码，其中 `asyncFlag=true` 表示异步（默认），`asyncFlag=false` 表示同步

     -   `send(content)` 函数

         向服务器发送请求

     -   `setRequestHeader("key", "value")` 函数

         设置请求头中属性为 `key` 的值为 `value`；在设置请求头之前需要先调用 `open()` 函数，设置的 header 将随着 `send()` 函数一起发送

2.   XMLHttpRequest 对象的属性

     -   `onreadystatechange`

         状态改变的事件触发器，每个状态改变时都会触发这个事件处理器，通常会调用一个 JavaScript 函数

     -   `readyState`

         请求的状态，有 5 个可取的值：

         -   0，未初始化，XMLHttpRequest 对象已创建
         -   1，`open()` 函数已调用，`send()` 函数未调用，请求还未发送
         -   2，`send()` 函数已调用，HTTP 请求已发送到服务器，未接收到响应
         -   3，所有响应头接收完成，响应体开始接收但未完成
         -   4，HTTP 响应接收完成

     -   `responseText`

         接收的数据文本格式的服务器响应体（不包括响应头）

     -   `responseXML`

         服务器的响应，兼容 DOM 的 XML 对象，解析后可得到 DOM 对象

     -   `status`

         服务器返回的 HTTP 状态码，用数字表示，如 200 表示“成功”，404 表示“资源未找到”

     -   `statusText`

         HTTP 状态码的文本表示，如状态码为 200 时，对应返回“OK”；状态码为 404 时，对应返回“Not Found”

#### 1.2 XMLHttpRequest 对象生命周期

1.   创建一个 XMLHttpRequest 对象

     由于浏览器的差异性，创建 XMLHttpRequest 对象时需要使用不同的方法，主要体现在 IE 浏览器与其他浏览器之间。下面是一个标准的 XMLHttpRequest 创建方法：

     ```javascript
     function createXMLHttp() {
         // code for IE7+, Firefox, Chrome, Opera, Safari
         if (window.XMLHttpRequest) {
             xmlhttp = new XMLHttpRequest()
         }
         // code for IE6, IE5
         if (window.ActiveXObject) {
             try {
                 xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
             }
             catch (e) {
                 try {
                     xmlhttp = new ActiveXObject("msxml2.XMLHTTP")
                 }
                 catch (ex) { }
             }
         }
     }
     ```

2.   建立连接

     ```javascript
     // 请求方式为 POST 请求，采用异步传输方式
     var xhr = createXMLHttp()
     xhr.open('post', '/admin/w/saveUser', true)
     ```

3.   发送请求并传递数据

     ```javascript
     var content = {
         username: 'tom',
         password: '123'
     };
     xhr.send(content)	// 由于传递的数据并不是必需的，content 值可以为空
     ```

4.   处理响应

     前面说到，`onreadystatechange` 属性表示 XMLHttpRequest 对象状态改变的事件触发器，每次 `readyState` 的取值变化时，属性 `onreadystatechange` 对应的函数都会被执行一次。

     当 `readyState` 的值为 4 时代表响应接收完成，但响应接收完成并不代表请求是成功的，需要通过 HTTP 请求 `status` 状态码来判断，当 `status` 值为 200 时代表请求成功。因此在 `onreadystatechange()` 回调函数中，需要同时判断 `readyState` 和 `status` 两个值才能对响应值做正确的处理。

     ```javascript
     xhr.onreadystatechange = function () {
         // 当 readyStatew 为 4，且状态码为 200 时代表请求成功
         if (xhr.readyState === 4 && xhr.status === 200) {
                // 处理响应值
             document.write(xhr.responseText)
         }
     }
     ```

#### 1.3 Ajax 的优缺点

-   优点

    1.   无刷新更新数据

         在不需要刷新页面的情况下，能够与服务端保持数据通信，使得 Web 应用程序能够快速地响应用户请求，避免不必要的等待时间，提高用户体验。

    2.   异步通信

         Ajax 使用异步的方式与服务端通信，能够减少不必要的数据传输，降低网络数据流量，使得响应更加迅速。

    3.   前后端分离

         Ajax 可以使得前后端分离开发更加完善，后端专注于接收请求、响应数据，前端专注于页面逻辑的处理。

    4.   前后端负载均衡

         在前后端进行分离开发后，以往由后端处理的数据逻辑，现在也可以交给前端处理，减轻服务端压力。

    5.   标准化支持

         Ajax 是一种基于 Web 标准化并被浏览器广泛支持的技术，不需要下载额外的插件，只需要客户允许 JavaScript 在浏览器上执行即可。

-   缺点

    1.   破坏浏览器的正常后退功能

         浏览器有一个很重要的功能是对历史记录的追溯，通过后退按钮可以退到浏览器之前访问过的页面，但是该按钮却没有办法和 JavaScript 进行很好的合作，从而导致 Ajax 对浏览器后退机制的破坏。

    2.   安全性问题

         Ajax 的逻辑可以将前端安全扫描技术隐藏起来，允许黑客从远端服务器上建立新的链接。同时 Ajax 也难以避免一些已知的安全性弱点，如跨域脚本攻击、SQL 注入攻击和基于 Credentials 的安全漏洞等。

    3.   对搜索引擎支持较弱

         浏览器在进行 SEO（搜索引擎优化）时，会屏蔽掉所有的 JavaScript 代码，导致了 SEO 对 Ajax 支持不友好。

    4.   违背 URL 唯一资源定位的初衷

         由于 Ajax 请求并不会改变浏览器地址栏的 URL，因此对于相同的 URL，不同的用户看到的内容可能是不一样的，这就违背了 URL 定位唯一资源的初衷。

### 2. 使用 Node.js 搭建简易服务器

1.   创建项目

     ```bash
     mkdir ajaxTest
     cd ajaxTest
     ```

2.   项目初始化

     ```bash
     npm init -y
     ```

     会得到一个 package.json 文件。

3.   安装依赖

     ```bash
     npm install express --save-dev
     ```

     >   书中还安装了一个依赖为：body-parser，但 express 4.16+ 已经内部集成了 bodyParser，不需要再 `require`，可以直接采用 `express.json()` 和 `express.urlencoded()` 实现相同功能。

4.   创建 server.js 文件

     在项目根目录下创建 server.js 文件，内容为：

     ```js
     var express = require('express')
     
     var app = express()
     // 实现和 body-parser 相同的效果
     app.use(express.json())
     app.use(express.urlencoded({
         extended: true
     }))
     
     // 接收 '/' 请求，指定首页
     app.get('/', function (req, res) {
         res.sendFile(__dirname + '/index.html')
     })
     
     // 处理 get 请求
     app.get('/getUser', function (req, res) {
         console.log(req.query)
     })
     
     // 处理 post 请求
     app.post('/saveUser', function (req, res) {
         var responseObj = {
             code: 200,
             message: '执行成功'
         }
         res.write(JSON.stringify.(responseObj)
         res.end('end')
     })
     
     // 执行监听的端口号
     var server = app.listen(3000, function () {})
     ```

5.   编写首页 index.html 的内容

     ```html
     <!DOCTYPE html>
     <html>
     
         <head>
             <meta charset="UTF-8">
             <title>Title</title>
         </head>
     
         <body>
             这是一个简易server的首页，Hello Nodejs
         </body>
     
     </html>
     ```

6.   运行服务

     在项目根目录下运行以下命令：

     ```bash
     node server.js
     ```

7.   查看运行效果

     在浏览器地址栏中输入 `http://localhost:3000` 即可看到首页内容。

### 3. 使用 Ajax 提交 form 表单

form 表单的默认提交方式会刷新页面，而且会在页面之间进行跳转。如果需要保持当前用户对表单状态的改变，就要在后台控制器和前端页面中传递更多的参数，因此对于前端与后台处理信息交互比较频繁的场景，form 表单默认的提交方式并不友好。

为了应对以上的场景，使用 Ajax 提交 form 表单是一种很好的解决办法。因为 Ajax 可以在不刷新页面的情况下提交请求，然后在处理响应时通过 JavaScript 操作 DOM，并展示后台处理的信息。

#### 3.1 通用处理

在使用 Ajax 提交 form 表单时，需要对 form 表单进行特殊的处理，包括以下几点：

-   将 `form` 标签的 `action` 属性和 `method` 属性去掉
-   将提交 `form` 表单按钮的 `type="submit"` 改为 `type="button"`

HTML 测试代码如下：

```html
<!DOCTYPE html>
<html>

    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>

    <body>
        <form name="userForm" id="userForm">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" class="form-control" name="username" id="username">
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" class="form-control" name="password" id="password">
            </div>
            <div class="form-group">
                <label for="telphone">电话</label>
                <input type="text" class="form-control" name="telphone" id="telphone">
            </div>
            <div class="form-group">
                <label for="email">邮箱</label>
                <input type="text" class="form-control" name="email" id="email">
            </div>
            <div class="text-center">
                <input type="button" class="btn btn-default btn-primary" value="提交" id="submit">
                <input type="button" class="btn btn-default" value="取消" id="cancel">
            </div>
        </form>
    </body>

</html>
```

#### 3.2 使用原生 Ajax 进行提交

使用原生 Ajax 提交 form 表单包含以下过程：

-   绑定提交按钮事件
-   创建 XMLHttpRequest 对象
-   建立连接
-   设置请求头
-   获取数据
-   发送请求
-   处理响应

实现过程如下：

1.   绑定提交按钮事件

     ```js
     var submitBtn = document.getElementById('submit')
     submitBtn.addEventListener('click', function () {
         ajaxSubmitForm()
     })
     ```

2.   创建 XMLHttpRequest 对象

     ```js
     function createXMLHttp() {
         // code for IE7+, Firefox, Chrome, Opera, Safari
         var xmlhttp
         if (window.XMLHttpRequest) {
             xmlhttp = new XMLHttpRequest()
         }
         // code for IE6, IE5
         if (window.ActiveXObject) {
             try {
                 xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
             }
             catch (e) {
                 try {
                     xmlhttp = new ActiveXObject("msxml2.XMLHTTP")
                 }
                 catch (ex) { }
             }
         }
         return xmlhttp
     }
     
     var xhr = createXMLHttp()
     ```

3.   建立连接

     ```js
     xhr.open('post', '/saveUser', true)
     ```

4.   设置请求头

     ```js
     xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
     ```

5.   获取数据

     ```js
     var username = document.getElementById('username').value
     var password = document.getElementById('password').value
     var telphone = document.getElementById('telphone').value
     var email = document.getElementById('email').value
     var content = {
         username: username,
         password: password,
         telphone: telphone,
         email: email
     }
     
     content = JSON.stringify(content)
     ```

6.   发送请求

     ```js
     xhr.send(content)
     ```

7.   处理响应

     ```js
     xhr.onreadystatechange = function () {
         // 当readyStatew为4，且状态码为200时代表请求成功
         if (xhr.readyState === 4 && xhr.status === 200) {
             // 处理响应值
             document.write(xhr.responseText)
         }
     }
     ```

完整代码：

```html
<script>
    var submitBtn = document.getElementById('submit')
    submitBtn.addEventListener('click', function () {
        ajaxSubmitForm()
    })

    function ajaxSubmitForm() {
        var xhr = createXMLHttp()
        xhr.open('post', '/saveUser', true)
        xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')

        var username = document.getElementById('username').value
        var password = document.getElementById('password').value
        var telphone = document.getElementById('telphone').value
        var email = document.getElementById('email').value
        var content = {
            username: username,
            password: password,
            telphone: telphone,
            email: email
        }

        content = JSON.stringify(content)
        xhr.send(content)

        xhr.onreadystatechange = function () {
            // 当readyStatew为4，且状态码为200时代表请求成功
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 处理响应值
                document.write(xhr.responseText)
            }
        }
    }

    function createXMLHttp() {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest()
        }
        // code for IE6, IE5
        if (window.ActiveXObject) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            catch (e) {
                try {
                    xmlhttp = new ActiveXObject("msxml2.XMLHTTP")
                }
                catch (ex) { }
            }
        }
        return xmlhttp
    }
</script>
```

#### 3.3 使用 jQuery 处理 Ajax 请求进行提交

jQuery 的诞生对 JavaScript 的发展来说是一个质的飞越，其中就包含了对 Ajax 请求的处理。使用 jQuery 处理 Ajax 请求，解决了浏览器兼容性的问题，对原生 Ajax 请求的高度封装也使得代码变得精简。我们只需要关注在使用 Ajax 时需要什么，然后传递对应的参数，处理不同的回调即可。

实现如下：

1.   文件引入

     ```html
     <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
     ```

2.   页面加载完成，绑定事件

     ```js
     $(function () {
         var submitBtn = $('#submit')
         submitBtn.click(function () {
             ajaxSubmitForm()
         })
     })
     ```

3.   获取传递的数据

     ```js
     var content = {
         username: $('#username').val(),
         password: $('#password').val(),
         telphone: $('#telphone').val(),
         email: $('#email').val()
     }
     ```

4.   使用 `$.ajax()` 函数发送请求

     在使用 `$.ajax()` 函数发送请求时，需要关注以下内容：

     -   请求类型
     -   请求URL
     -   请求数据类型
     -   传递的数据
     -   响应数据类型
     -   回调函数 -- 包括在发送请求之前调用的 `beforeSend()` 函数、请求出错的 `error()` 函数、请求成功的 `success()` 函数、请求完成的 `complete()` 函数

     ```js
     $.ajax({
         // 请求类型
         type: 'POST',
         // 请求 URL
         url: '/saveUser',
         // 请求数据类型设置
         contentType: 'application/json;charset=UTF-8',
         // 响应数据类型设置
         dataType: 'json',
         // 传递的参数
         data: JSON.stringify(content),
         // 执行成功的回调函数
         success: function (response) {
             console.log('函数执行成功')
         },
         // 执行完成的回调函数
         complete: function (response) {
             console.log('函数执行完成')
         },
         // 执行失败的回调函数
         error: function () {
             console.log('函数执行失败')
         }
     })
     
     // 下面是简写方式
     $.ajax({
         // 请求类型
         type: 'POST',
         // 请求URL
         url: '/saveUser',
         // 响应数据类型设置
         dataType: 'json',
         // 传递的参数
        data: content,
         // 执行成功的回调函数
         success: function (response) {
             console.log('函数执行成功')
         },
         // 执行完成的回调函数
         complete: function (response) {
             console.log('函数执行完成')
         },
         // 执行失败的回调函数
         error: function (response) {
             console.log('函数执行失败')
         }
     })
     ```

#### 3.4 使用 jQuery 序列化 form 表单进行提交

表单的序列化，表示的是可以自动将表单内填写的内容自动处理为字符串或者对象格式，便于与服务端进行传递，从而避免重复性地通过代码获取单个表单元素输入值。

在使用 jQuery 序列化 form 表单时，可以调用 `serialize()` 函数或者 `serializeArray()` 函数，基本语法如下：

```js
$(selector).serialize()
$(selector).serializeArray()
```

相同点：

-   需要对 form 表单元素设置 `name` 属性值，序列化后的值都为键值对类型，键为 `name` 属性值，值为输入的值
-   只会序列化特定标签的元素，包括 `input`、`textarea`、`select` 等，对于 `type='file'` 的元素不会进行序列化
-   两种方法都是对 form 表单元素或者 form 表单本身对应的 jQuery 对象进行序列化

不同点：

-   `serialize()` 函数序列化后的值为基本的字符串类型
-   `serializeArray()` 函数序列化后的值为 JSON 对象数组类型

使用序列化的代码：

```js
$.ajax({
    // 请求类型
    type: 'POST',
    // 请求URL
    url: '/saveUser',
    // 响应数据类型设置
    dataType: 'json',
    // 传递的参数，使用序列化的方式
    data: $('#userForm').serialize(),
    // 执行成功的回调函数
    success: function (response) {
        console.log('函数执行成功')
    },
    // 执行完成的回调函数
    complete: function (response) {
        console.log('函数执行完成')
    },
    // 执行失败的回调函数
    error: function (response) {
        console.log('函数执行失败')
    }
})
```

#### 3.5 使用 FormData 对象进行提交



