# coding=utf-8
import json

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


def do_js(func, code, input, type):
    import execjs
    isError = False
    try:
        if type == 'B8':
            js = execjs.compile(f'''
                        function ListNode(val) {{
                            this.val = val;
                            this.next = null;
                        }}
                        function insertList(nums){{
                            let pre=new ListNode(nums[0]);
                            const head=pre;
                            for(let i=1;i<nums.length;i++){{
                                const node = new ListNode();
                                node.val=nums[i];
                                pre.next=node;
                                pre=node;
                            }}
                            return head;
                        }}
                        function toString(head){{
                            const results=[];
                            while(head!=null){{
                                results.push(head.val);
                                head=head.next;
                            }}
                            return '['+results.join(',')+']'
                        }}
                        {code}
                        function run(nums,value){{
                            const head = insertList(nums);
                            let node = head;
                            while(node!=null){{
                                if(node.val===value) {func}(node);
                                node=node.next;
                            }}
                            return toString(head);
                        }}
                    ''')
            result = js.eval(f'run({input},5)')
        else:
            js = execjs.compile(f'''
                {code}
            ''')
            result = str(js.eval(f"{func}({input})")).replace(' ', '')
    except Exception as e:
        result = e
        isError = True
    return result, isError


def do_py(func, code, input):
    isError = False
    LOC = f""" 
{code} 
"""
    try:
        exec(LOC)
        print(LOC)
        result = eval(f'{func}({input})')
        result = str(result).replace(' ', '')
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
    if len(circle_labels) == 0:
        return content_labels
    results = []
    result = ''
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


def is_rs_eauals(rs1, rs2):
    if len(rs1) != len(rs2):
        return False
    return True

# words = ['解释器','编译器','js']
#
# for result in results:
#     for word in words:
#         score=text.get_sim(result,word).get('score')
#         if score < 0.5:
#             print(f'{score},{result},{word}')
# print('1'+'1')
