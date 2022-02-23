import simplejson
import MySQLdb


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
    return simplejson.dumps(json_data)


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
