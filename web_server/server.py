#!/usr/bin/env python

from tornado.options import options, define, parse_command_line
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.wsgi
import tornado.websocket
import json

define('port', type=int, default=8888)


class HelloHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("static/client.html")


class clientJS(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", 'text/javascript; charset="utf-8"')
        with open("static/client.js", "r") as f:
            self.write(f.read())


class clientCSS(tornado.web.RequestHandler):
    def get(self):
        with open("static/style.css", "r") as f:
            # self.set_header('Content-Type', "text/css")
            self.set_header("Content-Type", 'text/css; charset="utf-8"')
            self.write(f.read())


class MyWebSocket(tornado.websocket.WebSocketHandler):
    clients = []

    def check_origin(self, origin):
        return True

    def open(self):
        # clients must be accessed through class object!!!
        MyWebSocket.clients.append(self)
        print("\nWebSocket opened")
        self.report_clients()

    def on_message(self, message):
        print("msg recevied", message)
        msg = json.loads(message)  # todo: safety?

        # send other clients this message
        for c in MyWebSocket.clients:
            if c != self:
                c.write_message(msg)

    def on_close(self):
        print("WebSocket closed")
        # clients must be accessed through class object!!!
        MyWebSocket.clients.remove(self)
        self.report_clients()

    def report_clients(self):
        print(f"Running {len(self.clients)} clients")


def main():
    tornado_app = tornado.web.Application([
        ('/', HelloHandler),
        ('/websocket', MyWebSocket),
        ('/client.js', clientJS),
        ('/style.css', clientCSS)
    ])
    server = tornado.httpserver.HTTPServer(tornado_app)
    server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()
