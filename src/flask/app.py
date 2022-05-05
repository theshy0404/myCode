# coding:utf-8
import random
import types
from time import *

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


@app.route('/user/message')
def user_message_info():
    if request.method == 'GET':
        dosql = open_sql('mycode')
        useridList = request.args.get('useridList').split(',')
        myid = request.args.get('userid')
        userMessage = []
        for userid in useridList:
            sql = f"call getUserMessageInfo('{userid}','{myid}');"
            result = simplejson.loads(do_sql(dosql, sql))[0]
            userMessage.append(result)
        close_sql(dosql)
        return simplejson.dumps(userMessage)


@app.route('/user/message/detail')
def user_message_detail():
    if request.method == 'GET':
        dosql = open_sql('mycode')
        userid = request.args.get('userid')
        id = request.args.get('id')
        sql = f"call update_messages('{userid}','{id}');"
        dosql = update_sql(dosql, sql)
        sql = f"call get_before_messages('{userid}','{id}');"
        messages = simplejson.loads(do_sql(dosql, sql))
        messages = messages[::-1]
        sql = f"call get_message_detail('{userid}','{id}');"
        result = simplejson.loads(do_sql(dosql, sql))[0]
        result["messages"] = messages
        close_sql(dosql)
        return simplejson.dumps([result])


@app.route('/problem/type/admin', methods=['GET', 'POST'])
def problem_type_admin():
    dosql = open_sql('mycode')
    if request.method == 'GET':
        sql = 'call select_problemtypes_admin();'
        results = do_sql(dosql, sql)
        close_sql(dosql)
        return results
    elif request.method == 'POST':
        params = request.json.get('params')
        sql = 'call empty_problemtypes();'
        dosql = update_sql(dosql, sql)
        for node in params.get('data'):
            parentid = node.get('parentid')
            if parentid != None:
                sql = f"insert into problemtypes(typeid,text,level,parentid)value('{node.get('typeid')}','{node.get('text')}',{node.get('level')},'{parentid}');"
            else:
                sql = f"insert into problemtypes(typeid,text,level,parentid)value('{node.get('typeid')}','{node.get('text')}',{node.get('level')},null);"
            dosql = update_sql(dosql, sql)
        close_sql(dosql)
        return '暂不支持数据库查询以外的操作'


@app.route('/problem/run', methods=['GET', 'POST'])
def problem_run():
    res = make_response()
    if request.method == 'POST':
        params = request.json.get('params')
        userid = params.get('userid')
        problemid = params.get('problemid')
        type = params.get('typeid')
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
            myoutput, isError = do_js(func, code, input, type);
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
        dosql = open_sql('mycode')
        sql = f"call get_problem_info('{params.get('problemid')}');"
        problem_info = simplejson.loads(do_sql(dosql, sql))[0]
        input = problem_info.get('input').split('\n')[0]
        output = problem_info.get('output').split('\n')[0]
        code = params.get('code')
        print(code)
        myoutput, isError = do_js(problem_info.get('func'), code, input, problem_info.get('type'));
        results = simplejson.loads(simplejson.dumps({}))
        results['output'] = myoutput
        results['isError'] = isError
        print(results)
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


@app.route('/problem/submit/note', methods=['GET', 'POST'])
def problem_submit_note():
    res = make_response()
    if request.method == 'POST':
        params = request.json.get('params')
        sql = f"call problem_submit_note({params.get('submitid')},'{params.get('problemid')}','{params.get('userid')}','{params.get('note')}');"
        dosql = open_sql('mycode')
        dosql = update_sql(dosql, sql)
        close_sql(dosql)
    return res


@app.route('/problems/admin', methods=['GET', 'POST'])
def get_problems_admin():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        isparams = 0
        userid = request.args.get('userid')
        if userid == None or userid == '':
            userid = 0
        if True:
            problemname = request.args.get('problemname')
            if problemname == None:
                problemname = 'all'
            type = request.args.get('type')
            if type == None:
                type = '0'
            rank = request.args.get('rank')
            if rank == None:
                rank = 0
            labels = request.args.get('labels')
            if labels == None:
                labels = ''
            status = request.args.get('status')
            if status == None:
                status = 0
            sql = f"call select_problems_admin({userid},1,'{problemname}','{type}',{rank},'{labels}',{status});"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/problems', methods=['GET', 'POST'])
def get_problems():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        isparams = 0
        userid = request.args.get('userid')
        if userid == None or userid == '':
            userid = 0
        if True:
            problemname = request.args.get('problemname')
            if problemname == None:
                problemname = 'all'
            type = request.args.get('type')
            if type == None:
                type = '0'
            rank = request.args.get('rank')
            if rank == None:
                rank = 0
            labels = request.args.get('labels')
            if labels == None:
                labels = ''
            status = request.args.get('status')
            if status == None:
                status = 0
            page = request.args.get('pageNo')
            if page == None:
                page = 1
            sql = f"call select_problems({userid},1,'{problemname}','{type}',{rank},'{labels}',{status},{page});"
        result = simplejson.loads(do_sql(dosql, sql))
        results = simplejson.loads(simplejson.dumps({}))
        # results["results"] = result
        results["total"] = len(result)
        page = int(page) - 1
        count = page * 8
        if len(result) < count + 8:
            result = result[count:]
        else:
            result = result[count:count + 8]
        results["results"] = result
        results = simplejson.dumps([results])
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
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    if request.method == 'POST':
        params = simplejson.loads(request.values.get('params'))
        input = params.get('input')
        if input != None:
            input = input.replace("\'", "\\\'")
        output = params.get('output')
        if output != None:
            output = output.replace("\'", "\\\'")
        if params.get('problemid') == None:
            params["problemid"] = str(random.randint(1111111111, 9999999999))
            sql = f"call add_problem('{params.get('problemid')}','{params.get('title')}','{params.get('msg')}','{input}','{output}',{params.get('rankid')},'{params.get('labels')}','{params.get('typeid')}','{params.get('func')}','{params.get('arguements')}','{params.get('template')}');"
        else:
            sql = f"call edit_problem('{params.get('problemid')}','{params.get('title')}','{params.get('msg')}','{input}','{output}',{params.get('rankid')},'{params.get('labels')}','{params.get('typeid')}','{params.get('func')}','{params.get('arguements')}','{params.get('template')}');"
        print(sql)
        dosql = update_sql(dosql, sql)
        close_sql(dosql)
    return res


@app.route('/problem/submit', methods=['GET', 'POST'])
def problem_submit():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        problemid = request.args.get('problemid')
        userid = request.args.get('userid')
        sql = f"call get_code_submit('{problemid}','{userid}')"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    if request.method == 'POST':
        params = request.json.get('params')
        dosql = open_sql('mycode')
        problemid = params.get('problemid')
        language = params.get('language')
        userid = params.get('userid')
        sql = f"call get_problem_info('{params.get('problemid')}');"
        problem_info = simplejson.loads(do_sql(dosql, sql))[0]
        input = problem_info.get('input').split('\n')
        func = problem_info.get('func')
        type = problem_info.get('typeid')
        if type != 'C':
            output = problem_info.get('output').split('\n')
            code = params.get('code')
            sum = len(input)
            count = 0
            wrong_output = ''
            wrong_input = ''
            except_output = ''
            for index in range(0, len(input)):
                if int(language) == 3:
                    result, isError = do_js(func, code, input[index], type)
                elif int(language) == 2:
                    result, isError = do_py(func, code, input[index])
                    print(result)
                if result == output[index]:
                    count += 1
                else:
                    wrong_input = input[index]
                    except_output = output[index]
                    wrong_output = result
                    break
            if count == sum:
                status = 1
            else:
                status = 2
            codes = params.get('code').replace('\'', '\\\'');
            sql = f"call add_code_submit('{problemid}','{userid}','{codes}',{language},{status})"
            dosql = update_sql(dosql, sql)
            close_sql(dosql)
            result = simplejson.loads(simplejson.dumps({}))
            result["except"] = count
            result["input"] = wrong_input
            result["output"] = except_output
            result["sum"] = sum
            result["result"] = wrong_output
            result["status"] = status
            result = simplejson.dumps([result])
            res.data = result
        else:
            template = problem_info.get('template')
            problem_sql = open_sql('mysales')
            result1 = simplejson.loads(do_sql(problem_sql, template))
            try:
                result2 = simplejson.loads(do_sql(problem_sql, params.get('code')))
                is_equals = is_rs_eauals(result1, result2)
            except Exception as e:
                result2 = str(e).replace('mysales', 'fake_database')
                is_equals = False
            close_sql(problem_sql)
            result = simplejson.loads(simplejson.dumps({}))
            result["except"] = 1 if is_equals else 0
            result["input"] = template
            result["output"] = simplejson.dumps(result1)
            result["sum"] = 1
            try:
                result["result"] = simplejson.dumps(result2)
            except:
                result["result"] = result2
            result["status"] = 1 if is_equals else 2
            result = simplejson.dumps([result])
            res.data = result
            sql = f"call add_code_submit('{problemid}','{userid}','{params.get('code')}',{language},{1 if is_equals else 2})"
            dosql = update_sql(dosql, sql)
            close_sql(dosql)
            close_sql(dosql)
    return res


@app.route('/plan/problem/submit', methods=['GET', 'POST'])
def plan_problem_submit():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        problemid = request.args.get('problemid')
        userid = request.args.get('userid')
        sql = f"call get_code_submit('{problemid}','{userid}')"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    if request.method == 'POST':
        params = request.json.get('params')
        dosql = open_sql('mycode')
        problemid = params.get('problemid')
        planid = params.get('planid')
        language = params.get('language')
        userid = params.get('userid')
        sql = f"call get_problem_info('{params.get('problemid')}');"
        problem_info = simplejson.loads(do_sql(dosql, sql))[0]
        input = problem_info.get('input').split('\n')
        func = problem_info.get('func')
        type = problem_info.get('type')
        output = problem_info.get('output').split('\n')
        code = params.get('code')
        sum = len(input)
        count = 0
        wrong_output = ''
        wrong_input = ''
        except_output = ''
        for index in range(0, len(input)):
            result, isError = do_js(func, code, input[index], type)
            if result == output[index]:
                count += 1
            else:
                wrong_input = input[index]
                except_output = output[index]
                wrong_output = result
                break
        if count == sum:
            status = 1
        else:
            status = 2
        codes = params.get('code').replace('\'', '\\\'');
        sql = f"call add_code_submit('{problemid}','{userid}','{codes}',{language},{status})"
        dosql = update_sql(dosql, sql)
        # 此处进行是否完成
        if status == 1:
            sql = f"call add_plan_user_problem('{planid}','{userid}','{problemid}');"
            print(sql)
            dosql = update_sql(dosql, sql)
        close_sql(dosql)
        result = simplejson.loads(simplejson.dumps({}))
        result["except"] = count
        result["input"] = wrong_input
        result["output"] = except_output
        result["sum"] = sum
        result["result"] = wrong_output
        result["status"] = status
        print(result)
        result = simplejson.dumps([result])
        res.data = result
    return res


@app.route('/problem/labels', methods=['GET', 'POST'])
def get_problem_labels():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        sql = f"call get_problem_labels();"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/learn/plan', methods=['GET', 'POST'])
def get_learn_plan():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        sql = f"call get_learn_plan();"
        results = do_sql(dosql, sql)
        res.data = results
    if request.method == 'POST':
        params = request.json.get('params')
        planid = str(random.randint(1111111111, 9999999999))
        planname = params.get('planname')
        msg = params.get('msg')
        labels = params.get('labels')
        partList = params.get('partList')
        problemList = params.get('problemList')
        sql = f"call add_learn_plan('{planid}','{planname}','{msg}','{labels}');"
        dosql = update_sql(dosql, sql)
        for part in partList:
            sql = f"call add_plan_part('{planid}',{part.get('partid')},'{part.get('partname')}','{part.get('msg')}');"
            print(sql)
            dosql = update_sql(dosql, sql)
        for problem in problemList:
            sql = f"call add_plan_problem('{planid}','{problem.get('problemid')}',{problem.get('part')},{problem.get('points')},{problem.get('needpoints')});"
            dosql = update_sql(dosql, sql)
    close_sql(dosql)
    return res


@app.route('/learn/plan/mine', methods=['GET', 'POST'])
def get_my_plan():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        userid = request.args.get('userid')
        sql = f"call get_user_plan('{userid}');"
        results = do_sql(dosql, sql)
        res.data = results
    if request.method == 'POST':
        params = request.json.get('params')
        userid = params.get('userid')
        planid = params.get('planid')
        sql = f"call add_user_plan('{userid}','{planid}');"
        print(sql)
        results = do_sql(dosql, sql)
        res.data = results
    close_sql(dosql)
    return res


@app.route('/learn/plan/problems', methods=['GET', 'POST'])
def get_plan_problems():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        sql = f"call get_plan_problems_admin();"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/learn/plan/detail', methods=['GET', 'POST'])
def get_plan_detail():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        results = simplejson.loads(simplejson.dumps({}))
        planid = request.args.get('planid')
        userid = request.args.get('userid')
        sql = f"call get_plan_detail('{planid}','{userid}');"
        detail = simplejson.loads(do_sql(dosql, sql))[0]
        labelid_list = detail.get('labels').split(',')
        labels = ''
        for labelid in labelid_list:
            sql = f"call get_problem_label('{labelid}');"
            labels += (',' + simplejson.loads(do_sql(dosql, sql))[0].get('text'))
        if labels != '':
            labels = labels[1:]
        detail["labels"] = labels
        results["detail"] = detail
        sql = f"call get_plan_problems('{planid}','{userid}');"
        results["problemList"] = simplejson.loads(do_sql(dosql, sql))
        sql = f"call get_plan_parts('{planid}');"
        results["partList"] = simplejson.loads(do_sql(dosql, sql))
        results = simplejson.dumps([results])
        res.data = results
    close_sql(dosql)
    return res


@app.route('/problems/total', methods=['GET', 'POST'])
def get_problem_total():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        sql = f"call get_problem_labels();"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/circle/join', methods=['GET', 'POST'])
def circle_join():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'POST':
        params = request.json.get('params')
        circleid = params.get('id')
        userid = params.get('userid')
        sql = f"call user_circles('{circleid}','{userid}');"
        dosql = update_sql(dosql, sql)
        close_sql(dosql)
    return res


@app.route('/problem/delete', methods=['GET', 'POST'])
def delete_problem():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        problemid = request.args.get('problemid')
        sql = f"call delete_problem({problemid});"
        dosql = update_sql(dosql, sql)
        close_sql(dosql)
    return res


@app.route('/problem/types', methods=['GET', 'POST'])
def get_problem_types():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        sql = f"call get_problem_types()"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/circle', methods=['GET', 'POST'])
def get_circle():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        id = request.args.get('id')
        userid = request.args.get('userid')
        if id == None:
            id = '0'
        if userid == None:
            userid = '0'
        sql = f"call get_circles('{id}','{userid}');"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    if request.method == 'POST':
        params = request.json.get('params')
        print(params)
        userid = params.get('userid')
        msg = params.get('msg')
        circlename = params.get('circlename')
        ispublic = params.get('ispublic')
        parentid = params.get('parentid')
        circleid = str(random.randint(1111111111, 9999999999))
        if parentid == 'root':
            sql = f"call add_circles('{circleid}','{circlename}','{msg}',null,1,'{userid}',0,{ispublic});"
        else:
            sql = f"call add_circles('{circleid}','{circlename}','{msg}','{parentid}',0,'{userid}',0,{ispublic});"
        print(sql)
        dosql = update_sql(dosql, sql)
        close_sql(dosql)
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
                labels = []
                for label in result_labels:
                    if label != '':
                        text = simplejson.loads(do_sql(dosql, f"call get_circle_label('{circleid}','{label}');"))
                        text = text[0].get('text')
                        labels.append(text)
                result['labels'] = ','.join(labels)
        res.data = simplejson.dumps(results)
        print(results)
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


@app.route('/problems/types', methods=['GET', 'POST'])
def problems_types():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        typeid = request.args.get('typeid')
        if (typeid == None):
            typeid = '0'
        sql = f"call select_problemtypes('{typeid}')"
        results = do_sql(dosql, sql)
        close_sql(dosql)
        res.data = results
    return res


@app.route('/problems/labels', methods=['GET', 'POST'])
def problems_labels():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        sql = f"select * from problemlabels;"
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


@app.route('/circle/forum', methods=['GET', 'POST'])
def circle_forum_nopublic():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'POST':
        params = request.values
        forumid = str(random.randint(1111111111, 9999999999))
        circleid = params.get('circleid')
        userid = params.get('userid')
        content = params.get('content')
        title = params.get('title')
        sql = f"call add_forum_nopublic('{circleid}','{forumid}','{userid}','{content}','{title}');"
        dosql = update_sql(dosql, sql)
        close_sql(dosql)
    return res


@app.route('/circle/forum/admin', methods=['GET', 'POST'])
def circle_forum_admin():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'GET':
        sql = "call get_forum_nopublic();"
        results = do_sql(dosql, sql)
        res.data = results
    close_sql(dosql)
    return res


@app.route('/forum/admin/unpass', methods=['GET', 'POST'])
def circle_forum_admin_un():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'POST':
        id = request.json.get('params').get('forumid')
        sql = f"delete from nopublicforums where forumid = '{id}';"
        print(sql)
        dosql = update_sql(dosql, sql)
    close_sql(dosql)
    return res


@app.route('/circle/forum/public', methods=['GET', 'POST'])
def circle_forum():
    res = make_response()
    dosql = open_sql('mycode')
    if request.method == 'POST':
        params = request.json.get('params')
        forumid = params.get('id')
        sql = f"select * from nopublicforums where forumid = '{forumid}';"
        forum_detail = simplejson.loads(do_sql(dosql, sql))[0]
        circleid = forum_detail.get('circleid')
        userid = forum_detail.get('userid')
        content = forum_detail.get('content')
        title = forum_detail.get('title')
        labels = content_to_labels(title, content)
        circle_labels = simplejson.loads(do_sql(dosql, f"call get_circle_labels('{circleid}');"))
        labels = concat_label(circle_labels, labels)
        result_labels = []
        for label in labels:
            if type(label) == str:
                labelid = str(random.randint(1111111111, 9999999999))
                dosql = update_sql(dosql, f"call add_circle_label('{circleid}','{labelid}','{label}');")
                result_labels.append(labelid)
            elif type(label) == dict:
                result_labels.append(label.get('id'))
        sql = f"call add_forum('{circleid}','{forumid}','{userid}','{content}','{title}','{','.join(result_labels)}');"
        dosql = update_sql(dosql, sql)
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
        language = params.get('language')
        title = params.get('title')
        if title == None:
            title = '暂无标题'
        content = params.get('content')
        labels = params.get('labels')
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
