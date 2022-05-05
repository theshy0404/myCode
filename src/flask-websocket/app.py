import simplejson
from flask import Flask
from flask_sockets import Sockets
from my_util import *

app = Flask(__name__)
sockets = Sockets(app)
usersWs = {}


# socket 路由，访问url是： ws://localhost:5000/echo
@sockets.route('/login')
def echo_socket(ws):
    while not ws.closed:
        userid = ws.receive()
        ws.send("This is Flask said" + userid)


# socket 路由，访问url是： ws://localhost:5000/echo
@sockets.route('/user/message')
def user_message_socket(ws):
    while not ws.closed:
        dataList = ws.receive().split('/myws/')
        action = dataList[0]
        if action == 'login':
            usersid = dataList[1]
            print(usersid)
            usersWs[usersid] = ws
            ws.send('login success/myws/{"code":200}')
        elif action == 'message':
            message = dataList[1]
            params=simplejson.loads(message)
            dosql = open_sql('mycode')
            sql = f"call sendMessage('{params.get('user')}','{params.get('to')}','{params.get('message')}',0,0,null);"
            dosql = update_sql(dosql, sql)
            close_sql(dosql)
            for userid in usersWs.keys():
                try:
                    usersWs[userid].send('message' + '/myws/' + message)
                except:
                    usersWs.pop(usersid)


# http 路由，访问url是： http://localhost:5000/
@app.route('/')
def hello():
    for user in users:
        user.send("This is Flask said,")
    return 'Hello World!'


if __name__ == "__main__":
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler

    server = pywsgi.WSGIServer(('', 5001), app, handler_class=WebSocketHandler)
    print("web server start ... ")
    server.serve_forever()
