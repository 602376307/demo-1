const express = require('express');
const app = express(); // 初始化express
const http = require('http').Server(app); // 创建个Http服务器
const io = require('socket.io')(http); // 将Http服务注入到io中
const path = require('path'); // 做路径处理

http.listen(8000, function() {
    console.log('服务开启成功')
})

app.use(express.static(path.join(__dirname + '/public')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'))
})

let userObj = {}

io.on('connection', (socket) => {
    socket.on('login', res => {
        console.log('用户登录', res);
        userObj[res] = socket
            // console.log(userObj);
    })
    socket.on('sends', res => {
        console.log(res);
        // io.sockets.emit('msgs', res)
        let tar = JSON.parse(res).targetUser
            // console.log(tar);
            // console.log(userObj);
            // console.log(userObj[tar]);
        if (tar) {
            userObj[tar].emit('addData', res) // 私聊
        } else {
            io.sockets.emit('addData', res) // 广播
        }
    })
})






// io.on('connection', function(socket) { // socket连接者对象
//     console.log('a user connected');
//     socket.on('login', res => {
//         console.log(res);
//         // io.sockets(拿到当前连接池里所有的socket对象-链接到我的所有人), emit()触发事件(前端事件叫sToC) ---- 广播
//         // io.sockets.emit('sToC', data) // 
//     })
// });