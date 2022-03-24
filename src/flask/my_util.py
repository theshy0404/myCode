# coding=utf-8
import simplejson
import MySQLdb
import my_text as text


def open_sql(database_name):
    db = MySQLdb.connect("localhost", "root", "sql2008", database_name, charset='utf8', autocommit=True)
    return db.cursor()


def close_sql(cursor):
    cursor.close()


def do_sql(cursor, sql):
    cursor.execute(sql)
    return result_to_json(cursor)


def update_sql(cursor, sql):
    cursor.execute(sql)
    return cursor


def result_to_json(cur):
    # try:
    #     row_headers = [x[0] for x in cur.description]
    #     rv = cur.fetchall()
    #     json_data = []
    #     for result in rv:
    #         json_data.append(dict(zip(row_headers, result)))
    #     print(json_data)
    #     return simplejson.dumps(json_data)
    # except:
    #     return 's'
    row_headers = [x[0] for x in cur.description]
    rv = cur.fetchall()
    json_data = []
    for result in rv:
        json_data.append(dict(zip(row_headers, result)))
    return simplejson.dumps(json_data, ensure_ascii=False)


def do_js(func, code, input):
    import execjs
    isError = False
    try:
        # js = execjs.compile(f'''
        # function run(list){{
        #     {code}
        #     return {func}(list);
        # }}
        # ''')
        # print(f'''
        # function run(list){{
        #     {code}
        #     return {func}(list);
        # }}
        # ''')
        # print(f'({code})([-1,0,3,5,9,12],9)')
        result = execjs.eval(f'({code})({input})')
    except Exception as e:
        result = e
        isError = True
    return result, isError


def do_python(func, code, input):
    isError = False
    LOC = f""" 
{code} 
"""
    try:
        exec(LOC)
        result = eval(f'{func}({input})')
    except Exception as e:
        result = e
        isError = True
    return result, isError


def get_label(dosql, labels):
    label_results = ''
    for label in labels:
        label_results += (',' + simplejson.loads(do_sql(dosql, f"call select_label('{label}');"))[0]['text'])
    return label_results[1:]


def content_to_labels(title, content):
    return text.get_labels(title, content)


def concat_label(circle_labels, content_labels):
    results = []
    for content_label in content_labels:
        for circle_label in circle_labels:
            score = text.get_sim(circle_label.get('label'), content_label).get('score')
            try:
                if float(score) > 0.5:
                    result = circle_label
                else:
                    result = content_label
            except:
                result = content_label
        results.append(result)
    return results

results = content_to_labels('react fiber','Fiber是对React核心算法的重构，2年重构的产物就是Fiber reconciler\
###forum/1318936142###')
print(results)
# words = ['解释器','编译器','js']
#
# for result in results:
#     for word in words:
#         score=text.get_sim(result,word).get('score')
#         if score < 0.5:
#             print(f'{score},{result},{word}')
