# coding:utf-8
import simplejson
from flask import Flask, escape, make_response, jsonify, request
from flask_cors import CORS
from my_util import *

app = Flask(__name__)
CORS(app, resources=r'/*')


@app.route('/')
def index():
    res = make_response()
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
    res.headers['Access-Control-Allow-Headers'] = 'x-requested-with'
    return 'Welcome to MyCode!'


@app.route('/login', methods=['GET', 'POST'])
def do_login():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        try:
            username = request.args.get('username')
            password = request.args.get('password')
            results = do_sql(dosql, f"call doLoginProcedure('{username}','{password}')")
            close_sql(dosql)
            result = simplejson.loads(results)[0]
            if result.get('code') is not None:
                if result.get('code') == '0404':
                    res.status_code = '1404'
                if result.get('code') == '0403':
                    res.status_code = '1403'
            res.data = results
        except:
            res.status_code = '1500'
        return res
    if request.method == 'POST':
        res.status_code = '1500'
        return res


@app.route('/product/')
def product_info():
    dosql = open_sql('mysales')
    if request.method == 'GET':
        productid = request.args.get('productid')
        if (productid == None):
            sql = 'select * from products'
        else:
            sql = f'select * from products where productid = {productid}'
        results = do_sql(dosql, sql)
        close_sql(dosql)
        return results
    elif request.method == 'POST':
        return '暂不支持数据库查询以外的操作'


@app.route('/problem/runJS', methods=['GET', 'POST'])
def problem_run_js():
    res = make_response()
    if request.method == 'POST':
        params = request.json.get('params')
        language = params.get('language')
        func = params.get('func')
        code = params.get('code')
        input = params.get('input')
        print(params)
        # inputList =list(map(lambda x: int(x), params.get('input').split(',')))
        # if len(inputList) == 1:
        #     input = inputList[0]
        # else:
        #     input = inputList
        output, isError = do_js(func, code, input);
        results = simplejson.loads(simplejson.dumps({}))
        results['data'] = output
        results['isError'] = isError
        results = simplejson.dumps([results])
        res.data = results
    return res

@app.route('/problem/runPy', methods=['GET', 'POST'])
def problem_run_python():
    res = make_response()
    if request.method == 'POST':
        params = request.json.get('params')
        func = params.get('func')
        language = params.get('language')
        input = params.get('input')
        code = params.get('code')
        output, isError = do_python(func,code, input);
        results = simplejson.loads(simplejson.dumps({}))
        results['data'] = output
        results['isError'] = isError
        results = simplejson.dumps([results])
        res.data = results
    return res


if __name__ == '__main__':
    app.run()
