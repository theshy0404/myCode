insert into users(userid,username,password,phone,email,emailtype)values
('1318936142','足利上総三郎',md5('wsyghhz2000'),'19157708957','Aa1318936142',1),
('1776882861','新田左中将义贞',md5('wsyghhz2000'),'19157708957','1776882861',2);

insert into emailtypes(emailid,emailname)values
(1,'@163.com'),
(2,'@qq.com');

insert into problems(problemid,title,msg,input1,input2,output1,output2,rankid,labels,type,languageid,createtime,func,arguemnts,template)values
('1318936141','两数之和','给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 
的那 两个 整数，并返回它们的数组下标.\n你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现.
\n你可以按任意顺序返回答案','[2,7,11,15],9','[3,3],6','[0,1]','[1,2]',1,'',1,1,'2021-1-15','twoSum','nums,target',''),
('1776882862','回文数','给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false。\n
回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。','121','true','-121','false',1,'',1,1,'2021-1-15','isPalindrome','str','');


insert into replys(problemid,replyid,userid,content,look,createtime,isCode,code)values
('1318936142','1318936142','1318936142','so good,is so cooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooool😄',0,now(),0,null);

insert into problemtypes(typeid,text)values
(1,'算法'),
(2,'数据结构'),
(3,'数据库');

insert into problemranks(rankid,text)values
(1,'简单'),
(2,'中等'),
(3,'困难');

insert into problemlabels(labelid,text,typeid)values
(11,'动态规划',1),
(12,'深度优先遍历',1),
(13,'广度优先遍历',1),
(21,'数组',2),
(22,'树',2),
(23,'栈',2);

insert into languages(languageid,text)values
(1,'c'),
(2,'python3'),
(3,'javascript'),
(4,'mysql');