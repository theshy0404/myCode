# import simplejson
#
#
# # for line in simplejson.loads(
# #         '[{"ProductID": 1, "ProductName": "王老吉凉茶", "EnglishName": "WangLaoJie Herbal Tea", "QuantityPerunit": "330ml*6罐", "Unit": "箱", "Unitprice": 19.80, "SupplierID": "wlj", "CategoryID": "A", "SubcategoryID": "A101", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 2, "ProductName": "青岛啤酒", "EnglishName": "Tsintao Beer", "QuantityPerunit": "330ml*6罐", "Unit": "箱", "Unitprice": 26.00, "SupplierID": "qtpj", "CategoryID": "A", "SubcategoryID": "A201", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 3, "ProductName": "华味亨冰糖杨梅干", "EnglishName": "Hua wei hang Dried Arbutus with Rock Sugar", "QuantityPerunit": "180g", "Unit": "罐", "Unitprice": 12.90, "SupplierID": "hwhsp", "CategoryID": "C", "SubcategoryID": "C4", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 4, "ProductName": "17.5°NFC鲜榨橙汁", "EnglishName": "17.5° Not From Concentrate Fresh Orange Juice", "QuantityPerunit": "330ml*6瓶", "Unit": "箱", "Unitprice": 90.00, "SupplierID": "nfsq", "CategoryID": "A", "SubcategoryID": "A102", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 5, "ProductName": "哈奇咖喱粉", "EnglishName": "Hachi curry powder", "QuantityPerunit": "40g", "Unit": "瓶", "Unitprice": 32.50, "SupplierID": "whmsp", "CategoryID": "B", "SubcategoryID": "B4", "Photopath": null, "Discontinued": null, "Notes": null}]'):
# #     for key in line.keys():
# #         print(line.get(key))
#
#
# def is_equals(rs1, rs2):
#     length1 = len(rs1)
#     length2 = len(rs2)
#     if length1 != length2:
#         return False
#     try:
#         for i in range(0, length1):
#             for key in rs1[i].keys():
#                 if rs1[i].get(key) != rs2[i].get(key):
#                     return False
#     except:
#         return False
#     return True
#
#
# print(
#     is_equals(
#         simplejson.loads(
#             '[{"ProductID": 1,"id":1, "ProductName": "王老吉凉茶", "EnglishName": "WangLaoJie Herbal Tea", "QuantityPerunit": "330ml*6罐", "Unit": "箱", "Unitprice": 19.80, "SupplierID": "wlj", "CategoryID": "A", "SubcategoryID": "A101", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 2, "ProductName": "青岛啤酒", "EnglishName": "Tsintao Beer", "QuantityPerunit": "330ml*6罐", "Unit": "箱", "Unitprice": 26.00, "SupplierID": "qtpj", "CategoryID": "A", "SubcategoryID": "A201", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 3, "ProductName": "华味亨冰糖杨梅干", "EnglishName": "Hua wei hang Dried Arbutus with Rock Sugar", "QuantityPerunit": "180g", "Unit": "罐", "Unitprice": 12.90, "SupplierID": "hwhsp", "CategoryID": "C", "SubcategoryID": "C4", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 4, "ProductName": "17.5°NFC鲜榨橙汁", "EnglishName": "17.5° Not From Concentrate Fresh Orange Juice", "QuantityPerunit": "330ml*6瓶", "Unit": "箱", "Unitprice": 90.00, "SupplierID": "nfsq", "CategoryID": "A", "SubcategoryID": "A102", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 5, "ProductName": "哈奇咖喱粉", "EnglishName": "Hachi curry powder", "QuantityPerunit": "40g", "Unit": "瓶", "Unitprice": 32.50, "SupplierID": "whmsp", "CategoryID": "B", "SubcategoryID": "B4", "Photopath": null, "Discontinued": null, "Notes": null}]'),
#         simplejson.loads(
#             '[{"ProductID": 1, "ProductName": "王老吉凉茶", "EnglishName": "WangLaoJie Herbal Tea", "QuantityPerunit": "330ml*6罐", "Unit": "箱", "Unitprice": 19.80, "SupplierID": "wlj", "CategoryID": "A", "SubcategoryID": "A101", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 2, "ProductName": "青岛啤酒", "EnglishName": "Tsintao Beer", "QuantityPerunit": "330ml*6罐", "Unit": "箱", "Unitprice": 26.00, "SupplierID": "qtpj", "CategoryID": "A", "SubcategoryID": "A201", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 3, "ProductName": "华味亨冰糖杨梅干", "EnglishName": "Hua wei hang Dried Arbutus with Rock Sugar", "QuantityPerunit": "180g", "Unit": "罐", "Unitprice": 12.90, "SupplierID": "hwhsp", "CategoryID": "C", "SubcategoryID": "C4", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 4, "ProductName": "17.5°NFC鲜榨橙汁", "EnglishName": "17.5° Not From Concentrate Fresh Orange Juice", "QuantityPerunit": "330ml*6瓶", "Unit": "箱", "Unitprice": 90.00, "SupplierID": "nfsq", "CategoryID": "A", "SubcategoryID": "A102", "Photopath": null, "Discontinued": null, "Notes": null}, {"ProductID": 5, "ProductName": "哈奇咖喱粉", "EnglishName": "Hachi curry powder", "QuantityPerunit": "40g", "Unit": "瓶", "Unitprice": 32.50, "SupplierID": "whmsp", "CategoryID": "B", "SubcategoryID": "B4", "Photopath": null, "Discontinued": null, "Notes": null}]'),
#     )
# )
import simplejson

# print(simplejson.loads(('{}')))
# print('1'-1)

print((1,2)[1])
