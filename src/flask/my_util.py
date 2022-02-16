import simplejson
import MySQLdb


def open_sql(database_name):
    db = MySQLdb.connect("localhost", "root", "sql2008", database_name, charset='utf8')
    return db.cursor()


def close_sql(cursor):
    cursor.close()


def do_sql(cursor, sql):
    cursor.execute(sql)
    return result_to_json(cursor)


def result_to_json(cur):
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
        print(result,isError)
    return result, isError


def do_python(func,code,input):
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
    print(LOC)
    print(result)
    print(isError)
    return result, isError
