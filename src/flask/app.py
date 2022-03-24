# coding:utf-8
import random
import types
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


@app.route('/problem/run', methods=['GET', 'POST'])
def problem_run():
    res = make_response()
    if request.method == 'POST':
        params = request.json.get('params')
        userid = params.get('userid')
        problemid = params.get('problemid')
        userid = params.get('userid')
        rightOutput = params.get('output')
        language = params.get('language')
        submitid = str(random.randint(1111111111, 9999999999))
        func = params.get('func')
        code = params.get('code')
        input = params.get('input')
        if language == 2:
            myoutput, isError = do_python(func, code, input);
        elif language == 3:
            myoutput, isError = do_js(func, code, input);
        results = simplejson.loads(simplejson.dumps({}))
        results['data'] = str(myoutput)
        results['isError'] = isError
        res.headers['Content-Type'] = 'application/json; charset=utf-8'
        results['data'] = str(myoutput)
        results['isError'] = isError
        results = simplejson.dumps([results])
        res.data = results
        dosql = open_sql('mycode')
        status = 0
        if str(myoutput) == str(rightOutput):
            status = 1
        else:
            status = 2
        if isError:
            status = 3
        sql = f"call add_code_submit('{problemid}','{submitid}','{userid}',{language},{status});"
        dosql = update_sql(dosql, sql)
        close_sql(dosql)
    return res


@app.route('/problem/runJS', methods=['GET', 'POST'])
def problem_run_js():
    res = make_response()
    if request.method == 'POST':
        params = request.json.get('params')
        language = params.get('language')
        func = params.get('func')
        code = params.get('code')
        input = params.get('input')
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
        input = params.get('input')
        code = params.get('code')
        output, isError = do_python(func, code, input);
        results = simplejson.loads(simplejson.dumps({}))
        results['data'] = output
        results['isError'] = isError
        results = simplejson.dumps([results])
        res.data = results
    return res


@app.route('/problem/runSQL', methods=['GET', 'POST'])
def problem_run_mysql():
    res = make_response()
    if request.method == 'POST':
        params = request.json.get('params')
        code = params.get('code')
        dosql = open_sql('mysales')
        results = do_sql(dosql, code)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/problems', methods=['GET', 'POST'])
def get_problems():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        userid = request.args.get('userid')
        if userid == None or userid == '':
            userid = 0
        problemid = request.args.get('problemid')
        if (problemid == None):
            sql = f'call select_problems({userid},0,\'all\',0,0,0,0);'
        else:
            problemname = request.args.get('problemname')
            if problemname == None:
                problemname = 'all'
            type = request.args.get('type')
            if type == None:
                type = 0
            rank = request.args.get('rank')
            if rank == None:
                rank = 0
            label = request.args.get('label')
            if label == None:
                label = 0
            status = request.args.get('status')
            if status == None:
                status = 0
            sql = f"call select_problems({userid},1,'{problemname}',{type},{rank},{label},{status});"
            print(sql)
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/problem/', methods=['GET', 'POST'])
def get_problem():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        problemid = request.args.get('problemid')
        sql = f"call problem_detail(\'{problemid}\')"
        results = simplejson.loads(do_sql(dosql, sql))
        if results[0].get('typeid') == 3:
            othersql = open_sql('mysales')
            result = do_sql(othersql, f"{results[0].get('template')} limit 10")
            results[0]["example"] = result
        results = simplejson.dumps(results, ensure_ascii=False)
        close_sql(dosql)
        res.data = results
    if request.method == 'POST':
        params = simplejson.loads(request.values.get('params'))
        if params.get('problemid') == None:
            params["problemid"] = str(random.randint(1111111111, 9999999999))
        params = simplejson.dumps([params], ensure_ascii=False)
        results = sql = f"call update_rows('mycode','problems','problemid','','{params}');"
        do_sql(dosql, sql)
        close_sql(dosql)
    return res


@app.route('/problem/submits', methods=['GET', 'POST'])
def get_problem_submits():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        problemid = request.args.get('problemid')
        userid = request.args.get('userid')
        sql = f"call get_code_submit('{problemid}','{userid}')"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/circle', methods=['GET', 'POST'])
def get_circle():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        problemid = request.args.get('problemid')
        if problemid == None:
            problemid = '0'
        sql = f"call get_circles('{problemid}');"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/forums', methods=['GET', 'POST'])
def get_forums():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        circleid = request.args.get('circleid')
        sql = f"call get_forums('{circleid}');"
        results = simplejson.loads(do_sql(dosql, sql))
        if len(results) != 0:
            for result in results:
                result_labels = result.get('labels').split(',')
                print(result_labels)
                labels = []
                for label in result_labels:
                    if label != '':
                        text = simplejson.loads(do_sql(dosql, f"call get_circle_label('{circleid}','{label}');"))
                        text = text[0].get('text')
                        labels.append(text)
                result['labels'] = ','.join(labels)
        res.data = simplejson.dumps(results)
        close_sql(dosql)
    return res


@app.route('/forum', methods=['GET', 'POST'])
def get_forum():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        forumid = request.args.get('forumid')
        sql = f"call get_forum('{forumid}');"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/forum/comment', methods=['GET', 'POST'])
def get_forum_comment():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        forumid = request.args.get('forumid')
        sql = f"call get_forum_comment('{forumid}');"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/forum/comments', methods=['GET', 'POST'])
def get_forum_comments():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        commentid = request.args.get('commentid')
        sql = f"call get_forum_comment_comment('{commentid}');"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/problems/labels', methods=['GET', 'POST'])
def problems_labels():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        typeid = request.args.get('typeid')
        if (typeid == None):
            typeid = 0
        sql = f"call select_problemtypes({typeid})"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/reply/comment/', methods=['GET', 'POST'])
def reply_comments():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        replyid = request.args.get('replyid')
        if (replyid == None):
            problemid = request.args.get('problemid')
            sql = f"call problem_replys('{problemid}');"
        else:
            sql = f"call reply_comments('{replyid}');"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        return results
    if request.method == 'POST':
        res = make_response()
        params = request.json.get('params')
        replyid = params.get('replyid')
        replyuserid = params.get('replyuserid')
        userid = params.get('userid')
        commentid = str(random.randint(1111111111, 9999999999))
        content = params.get('content')
        sql = f"call add_reply_comment('{commentid}','{replyid}','{userid}','{replyuserid}','{content}');"
        update_sql(dosql, sql)
        close_sql(dosql)
        return res


@app.route('/problem/submit/', methods=['GET', 'POST'])
def problem_submit():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        res = make_response()
        problemid = request.args.get('problemid')
        userid = request.args.get('userid')
        sql = f"call get_code_submit('{problemid}','{userid}])"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
        return res


@app.route('/circle/labels', methods=['GET', 'POST'])
def circle_labels():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        res = make_response()
        circleid = request.args.get('circleid')
        sql = f"call get_circle_labels('{circleid}');"
        print(sql)
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
        return res


@app.route('/circle/label/forum', methods=['GET', 'POST'])
def label_forums():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        res = make_response()
        circleid = request.args.get('circleid')
        labelid = request.args.get('labelid')
        sql = f"call get_labels_forums('{circleid}','{labelid}');"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
        return res


@app.route('/forumorcomment', methods=['GET', 'POST'])
def forum_comment():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        res = make_response()
        id = request.args.get('id')
        type = request.args.get('type')
        if type == 'forum':
            sql = f"call get_forum_info('{id}')"
        if type == 'comment':
            sql = f"call get_comment_info('{id}')"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
        return res


@app.route('/problem/solution/', methods=['GET', 'POST'])
def problem_solution():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        res = make_response()
        solutionid = request.args.get('solutionid')
        sql = f"call get_solution('{solutionid}');"
        results = simplejson.loads(do_sql(dosql, sql))
        result = results[0]
        labels = result['labels']
        try:
            labels = labels['labels'].split(';')
            labels = str(get_label(dosql, labels))
            result['labels'] = labels
        except:
            result['labels'] = ''
        results = [result]
        res.data = simplejson.dumps(results)
        return res


@app.route('/circle/forum/', methods=['GET', 'POST'])
def circle_forum():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'POST':
        params = request.values
        forumid = str(random.randint(1111111111, 9999999999))
        circleid = params.get('circleid')
        userid = params.get('userid')
        isofficial = params.get('isofficial')
        content = params.get('content')
        title = params.get('title')
        labels = content_to_labels(title, content)
        circle_labels = simplejson.loads(do_sql(dosql, f"call get_circle_labels('{circleid}');"))
        labels = concat_label(circle_labels, labels)
        result_labels = []
        for label in labels:
            print(label)
            if type(label) == str:
                labelid = str(random.randint(1111111111, 9999999999))
                dosql = update_sql(dosql, f"call add_circle_label('{circleid}','{labelid}','{label}');")
                result_labels.append(labelid)
            elif type(label) == dict:
                result_labels.append(label.get('id'))
        sql = f"call add_forum('{circleid}','{forumid}','{userid}',{isofficial},'{content}','{title}','{','.join(result_labels)}');"
        print(sql)
        results = do_sql(dosql, sql)
        res.data = results
    return res


@app.route('/problem/solutions/', methods=['GET', 'POST'])
def problem_solutions():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        res = make_response()
        problemid = request.args.get('problemid')
        sql = f"call get_solutions('{problemid}');"
        results = simplejson.loads(do_sql(dosql, sql))
        for result in results:
            labels = result['labels'].split(';')
            try:
                labels = str(get_label(dosql, labels))
                result['labels'] = labels
            except:
                result['labels'] = ''
        res.data = simplejson.dumps(results)
        close_sql(dosql)
        return res
    if request.method == 'POST':
        res = make_response()
        params = request.values
        dosql = open_sql('mycode')
        solutionid = str(random.randint(1111111111, 9999999999))
        problemid = params.get('problemid')
        userid = params.get('problemid')
        isofficial = params.get('isofficial')
        title = params.get('title')
        if title == None:
            title = '暂无标题'
        content = params.get('content')
        labels = params.get('labels')
        language = params.get('language')
        sql = f"call add_problem_solution('{solutionid}','{problemid}','{isofficial}','{userid}','{title}','{language}','{content}','','{labels}')"
        dosql = update_sql(dosql, sql)
        close_sql(dosql)
        return res


@app.route('/solution/label/', methods=['GET', 'POST'])
def solution_label():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        res = make_response()
        sql = f"call get_solution_labels();"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/label/solution/', methods=['GET', 'POST'])
def label_solution():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        res = make_response()
        language = request.args.get('language')
        problemid = request.args.get('problemid')
        if (language == None):
            language = 0
        sql = f"call get_label_solutions('{problemid}','{language}',0);"
        results = do_sql(dosql, sql)
        res.data = results
        labels = request.args.get('labels')
        if (labels != ''):
            labels_id = []
            results = simplejson.loads(results)
            for item in results:
                labels_id.append(item['solutionid'])
            labels = labels[1:]
            label_list = labels.split(',')
            for label in label_list:
                sql = f"call get_label_solutions('{problemid}','{language}',{label});"
                result = simplejson.loads(do_sql(dosql, sql))
                label_id = []
                for item in result:
                    label_id.append(item['solutionid'])
                labels_id = list(set(labels_id).intersection(set(label_id)))
            new_results = []
            for result in results:
                if (result['solutionid'] in labels_id):
                    labels = result['labels'].split(';')
                    labels = str(get_label(dosql, labels))
                    result['labels'] = labels
                    new_results.append(result)
            new_results = simplejson.dumps(new_results)
            res.data = new_results
        close_sql(dosql)
    return res


if __name__ == '__main__':
    app.run()
