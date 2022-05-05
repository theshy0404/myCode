insert into users(userid,username,password,phone,email,emailtype)values
('1318936142','足利上総三郎',md5('wsyghhz2000'),'19157708957','Aa1318936142',1),
('1318936143','北条相模守高时',md5('wsyghhz2000'),'19157708957','Aa1318936142',1),
('1318936144','源陆奥守义家',md5('wsyghhz2000'),'19157708957','Aa1318936142',1),
('1318936145','上杉权中纳言景胜',md5('wsyghhz2000'),'19157708957','Aa1318936142',1),
('1318936146','足利左兵卫督高氏',md5('wsyghhz2000'),'19157708957','Aa1318936142',1),
('1318936147','藤原关白左大臣师家',md5('wsyghhz2000'),'19157708957','Aa1318936142',1),
('1318936148','大内右京大夫义兴',md5('wsyghhz2000'),'19157708957','Aa1318936142',1),
('1318936149','平相国入道清盛',md5('wsyghhz2000'),'19157708957','Aa1318936142',1),
('1776882861','新田左中将义贞',md5('wsyghhz2000'),'19157708957','1776882861',2);

insert into emailtypes(emailid,emailname)values
(1,'@163.com'),
(2,'@qq.com');

/*
insert into problems(problemid,title,msg,input,output,rankid,labels,typeid,createtime,func,arguements,template)values
('1318936142','两数之和','给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 
的那 两个 整数，并返回它们的数组下标.\n你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现.
\n你可以按任意顺序返回答案','2,7','9',1,'006,007','A5','2021-1-15','twoSum','a,b',''),
('1776882861','回文数','给你一个字符串 s，找到 s 中最长的回文子串','121','true',1,'001,009','A1','2021-1-15','isPalindrome','str','');
*/

insert into replys(problemid,replyid,userid,content,good,look,createtime,isCode,code,commentCount)values
('1318936142','1318936142','1318936142','so good,is so cooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooool😄',0,0,now(),0,null,2),
('1318936142','1776882861','1776882861','so good,is so cooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooool😄',0,0,now(),0,null,0);

insert into replycomments(commentid,replyid,userid,replyuserid,content,createtime)values
('1318936142','1318936142','1318936142',null,'so cool',now()),
('1776882861','1318936142','1776882861','1318936142','so cool',now());

insert into problemtypes(typeid,text,level,parentid)values
('A','算法',0,null),
('A1','动态规划',1,'A'),
('A2','图遍历',1,'A'),
('A3','回溯法',1,'A'),
('A4','排序',1,'A'),
('A5','搜索',1,'A'),
('B','数据结构',0,null),
('B1','数组',1,'B'),
('B2','二叉树',1,'B'),
('B3','栈',1,'B'),
('B4','队列',1,'B'),
('B5','图',1,'B'),
('B6','堆',1,'B'),
('B7','集合',1,'B'),
('B8','链表',1,'B'),
('C','数据库',0,null);

insert into problemranks(rankid,text)values
(1,'简单'),
(2,'中等'),
(3,'困难');

insert into problemlabels(labelid,text)values
('001','动态规划'),
('002','深度优先遍历'),
('003','广度优先遍历'),
('004','回溯法'),
('005','双指针'),
('006','数组'),
('007','哈希表'),
('008','递归'),
('009','字符串'),
('010','滑动窗口'),
('011','数学'),
('012','正则');

insert into languages(languageid,text)values
(1,'c'),
(2,'python3'),
(3,'javascript'),
(4,'mysql');

/*
insert into problemstatus(problemid,userid,status)values
('1318936142','1318936142',1);
*/

insert into solutions(solutionid,problemid,isofficial,userid,title,good,language,createtime,hasCode,content,code,labels,isPublic)values
('1318936142','1318936142',1,'1318936142','快速求出两数之和',0,3,now(),1,'当我们使用遍历整个数组的方式寻找 target - x 时.需要注意到每一个位于 x 之前的元素都已经和x匹配过因此不需要再进行匹配。而每一个元素不能被使用两次，所以我们只需要在 x 后面的元素中寻找','function twoSum(a,b) {\n\t\treturn a+b;\n}','11;21',1),
('1776882861','1318936142',0,'1318936142','快速求出两数之和',0,3,now(),1,'当我们使用遍历整个数组的方式寻找 target - x 时.需要注意到每一个位于 x 之前的元素都已经和x匹配过因此不需要再进行匹配。而每一个元素不能被使用两次，所以我们只需要在 x 后面的元素中寻找','function twoSum(a,b) {\n\t\treturn a+b;\n}','11;22',1);

insert into circles(circleid,circlename,msg,parentid,haschildren,fans,ispublic,createtime,creater)values
('1318936142','前端','',null,1,0,1,now(),'0000000000'),
('1318936143','HTML','超文本标记语言（英语：HyperText Markup Language，简称：HTML）是一种用于创建网页的标准标记语言。可以使用 HTML 来建立自己的 WEB 站点，HTML 运行在浏览器上，由浏览器来解析。','1318936142',0,1,1,now(),'0000000000'),
('1318936144','CSS','层叠样式表是一种用来表现HTML或XML等文件样式的计算机语言','1318936142',0,1,1,now(),'0000000000'),
('1318936145','JavaScript','JavaScript（简称“JS”） 是一种具有函数优先的轻量级，解释型或即时编译型的编程语言。虽然它是作为开发Web页面的脚本语言而出名，但是它也被用到了很多非浏览器环境中，JavaScript 基于原型编程、多范式的动态脚本语言，并且支持面向对象、命令式、声明式、函数式编程范式。','1318936142',0,1,1,now(),'0000000000'),
('1318936146','Vue','Vue是一套用于构建用户界面的渐进式框架。','1318936142',0,1,1,now(),'0000000000'),
('1318936147','React','React 是一个用于构建用户界面的 JavaScript 库。','1318936142',0,1,1,now(),'0000000000'),
('1776882861','数据库','',null,1,0,1,now(),'0000000000'),
('1776882862','MySQL','MySQL 是最流行的关系型数据库管理系统之一，在 WEB 应用方面，MySQL是最好的 RDBMS (Relational Database Management System，关系数据库管理系统) 应用软件之一。','1776882861',0,1,1,now(),'0000000000');

/*
 insert into forums(circleid,forumid,good,star,userid,isofficial,isrecommend,istop,content,title,labels)values
 ('1318936143','1318936142',0,0,'1318936142',0,1,1,'现在，让我们关注实际执行 JavaScript 代码的这部分流程，即代码被解释和优化的地方，并讨论其在主要的 JavaScript 引擎之间存在的一些差异。
一般来说，（所有 JavaSciript 引擎）都有一个包含解释器和优化编译器的处理流程。其中，解释器可以快速生成未优化的字节码，而优化编译器会需要更长的时间，以便最终生成高度优化的机器码。
这个通用流程几乎与在 Chrome 和 Node.js 中使用的 V8 引擎工作流程一致：V8 中的解释器被称作 Ignition，它负责生成并执行字节码。当它运行字节码时会收集分析数据，而它之后可以被用于加快（代码）执行的速度。当一个函数变得 hot，例如它经常被调用，生成的字节码和分析数据则会被传给 TurboFan——我们的优化编译器，它会依据分析数据生成高度优化的机器码。
SpiderMonkey，在 Firefox 和 SpiderNode 中使用的 Mozilla 的 JavaScript 引擎，则有一些不同的地方。它们有两个优化编译器。解释器将代码解释给 Baseline 编译器，该编译器可以生成部分优化的代码。 结合运行代码时收集的分析数据，IonMonkey 编译器可以生成高度优化的代码。 如果尝试优化失败，IonMonkey 将回退到 Baseline 阶段的代码。
Chakra，用于 Edge 和 Node-ChakraCore 两个项目的微软 JavaScript 引擎，也有类似两个优化编译器的设置。解释器将代码优化成 SimpleJIT——其中 JIT 代表 Just-In-Time 编译器——它可以生成部分优化的代码。 结合分析数据，FullJIT 可以生成更深入优化的代码。
JavaScriptCore（缩写为JSC），Apple 的 JavaScript 引擎，被用于 Safari 和 React Native 两个项目中，它通过三种不同的优化编译器使效果达到极致。低级解释器 LLInt将代码解释后传递给 Baseline 编译器，而（经过 Baseline 编译器）优化后的代码便传给了 DFG 编译器，（在 DFG 编译器处理后）结果最终传给了 FTL 编译器进行处理。
为什么有些引擎会拥有更多的优化编译器呢？这完全是一些折衷的取舍。解释器可以快速生成字节码，但字节码通常不够高效。另一方面，优化编译器处理需要更长的时间，但最终会生成更高效的机器码。到底是快速获取可执行的代码（解释器），还是花费更多时间但最终以最佳性能运行代码（优化编译器），这其中包含一个平衡点。一些引
擎选择添加具有不同耗时/效率特性的多个优化编译器，以更高的复杂性为代价来对这些折衷点进行更细粒度的控制。我们刚刚强调了每个 JavaScript 引擎中解释器和优化编译器流程中的主要区别。除了这些差异之外，所有 JavaScript 引擎都有相同的架构：那就是拥有一个解析器和某种解
释器/编译器流程。','带你走进JavaScript解释器','javascript,代码优化,编译器优化,字节码,jit编译器');
*/
insert into forumcommentsone(commentid,forumid,userid,content,good,star,labels)values
('1318936142','1318936142','1776882861','Fiber是对React核心算法的重构，2年重构的产物就是Fiber reconciler',0,0,'react');

insert into forumcommentstwo(commentid,rootid,userid,content,isreply,replyuserid,replyusername)values
('1318936142','1318936142','1318936142','React希望通过Fiber重构来改变这种不可控的现状，进一步提升交互体验',1,'1776882861','新田左中将义贞');

insert into text_labels(circleid,labelid,text)values
('1318936143','1776882861','编译器'),
('1318936143','1318936142','生命周期');

insert into users_messages(userid,receiveid,message,time,status,isreceive,receivemessageid)values
('1776882861','1318936142','我们的同志在困难的时候，要看到成绩，要看到光明，要提高我们的勇气。',now(),0,0,null),
('1776882861','1318936142','银鞍照白马，飒沓如流星。',now(),0,0,null),
('1318936142','1776882861','君子惠而不费，劳而不怨，欲而不贪，泰而不骄，威而不猛。',now(),0,0,null),
('1318936142','1776882861','君子惠而不费，劳而不怨，欲而不贪，泰而不骄，威而不猛。',now(),0,0,null),
('1318936142','1776882861','君子惠而不费，劳而不怨，欲而不贪，泰而不骄，威而不猛。',now(),0,0,null),
('1318936142','1776882861','君子惠而不费，劳而不怨，欲而不贪，泰而不骄，威而不猛。',now(),0,0,null),
('1318936142','1776882861','君子惠而不费，劳而不怨，欲而不贪，泰而不骄，威而不猛。',now(),0,0,null),
('1318936142','1776882861','君子惠而不费，劳而不怨，欲而不贪，泰而不骄，威而不猛。',now(),0,0,null),
('1318936142','1776882861','君子惠而不费，劳而不怨，欲而不贪，泰而不骄，威而不猛。',now(),0,0,null);