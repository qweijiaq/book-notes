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
    res.write(JSON.stringify(responseObj))
    res.end('end')
})

// 执行监听的端口号
var server = app.listen(3000, function () {})