from flask import Flask , escape
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:sql2008@127.0.0.1:3306/mycode?charset=utf8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# 在扩展类实例化前加载配置
db = SQLAlchemy(app)

class Movie(db.Model):  # 表名将会是 movie
    id = db.Column(db.Integer, primary_key=True)  # 主键
    title = db.Column(db.String(60))  # 电影标题
    year = db.Column(db.String(4))  # 电影年