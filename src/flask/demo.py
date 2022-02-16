import execjs

js = execjs.compile('''
function sum(a,b){
return a+b;
}
''')
print(js.eval('sum(2,1)'))
