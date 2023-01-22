-- create database myCode;
use myCode;

-- 用户表
drop table if exists users;
create table users(
	userid char(10) primary key,
	username varchar(30),
	password varchar(50),
	phone varchar(30) null,
	email varchar(30) null,
    emailtype int
);

-- 邮箱类别表
drop table if exists emailtypes;
create table emailtypes(
	emailid int,
    emailname varchar(20)
);

-- 题目表
drop table if exists problems;
create table problems(
	problemid char(10) primary key,
    title varchar(20),
    msg varchar(5000),
    input varchar(2000) null,
    output varchar(2000) null,
    rankid int,
    labels varchar(50),
    typeid varchar(10),
    createtime char(20),
    func varchar(30) null,
    arguements varchar(20) null,
    template varchar(300) null
);

-- 题解表
drop table if exists solutions;
create table solutions(
	solutionid char(10) primary key,
    problemid char(10),
    isofficial int,  
    userid char(10),
    title varchar(50),
    good int,
    language int,
    createtime varchar(20),
    hasCode int,
    isMarkDown int,
    content varchar(2000),
    code varchar(2000),
    labels varchar(20),
    isPublic int
);

-- 题目回复表
drop table if exists replys;
create table replys(
	problemid char(10),
    replyid char(10) primary key,
    userid char(10),
    content varchar(2000),
    good int,
    look int,
    createtime varchar(20),
    isCode int,
    code varchar(20),
    commentCount int
);

-- 提交记录表
drop table if exists submitItems;
create table submitItems(
	problemid char(10),
    submitid int primary key auto_increment,
    userid char(10),
    createtime varchar(20),
    codes varchar(2000),
    language int,
    status int,
    note varchar(200)
);

-- 类别表
drop table if exists problemtypes;
create table problemtypes(
	typeid char(20) primary key,
    text varchar(10),
    level int,
    parentid char(2) null
);
select * from problemtypes;

-- 难度表 
drop table if exists problemranks;
create table problemranks(
	rankid int primary key,
    text varchar(10)
);

-- 标签表 
drop table if exists problemlabels;
create table problemlabels(
	labelid char(10) primary key,
    text varchar(10)
);

-- 回复评论表
drop table if exists replycomments;
create table replycomments(
	commentid char(10) primary key,
	replyid char(10),
    userid char(10),
    replyuserid char(10) null,
    content varchar(200),
    createtime varchar(20)
);

-- 题解评论表 
drop table if exists solutioncomments;
create table solutioncomments(
	commentid char(10) primary key,
	replyid char(10),
    userid char(10),
    replyuserid char(10),
    replyusername varchar(10),
    level int,
    parentid char(10),
    createtime varchar(20)
);

-- 语言表
drop table if exists languages;
create table languages(
	languageid int primary key,
    text varchar(10)
);

-- 题目状态表
drop table if exists problemstatus;
create table problemstatus(
	id int primary key auto_increment,
	problemid char(10),
    userid char(10),
    status int null
);

-- 圈子表
drop table if exists circles;
create table circles(
	circleid char(10),
	circlename varchar(20),
	msg varchar(2000),
	parentid char(10) null,
	hasChildren int,
    createtime varchar(20),
    creater char(10),
    fans int,
    ispublic int
);

-- 喜欢圈子表
drop table if exists user_circles;
create table user_circles(
	id int auto_increment primary key,
    circleid char(10),
    userid char(10),
    point int,
    jointime varchar(20)
);

-- 审核不通过记录表
drop table if exists no_forums;
create table no_forums(
	id int auto_increment primary key,
    forumid char(10),
    reason varchar(200),
    userid char(10),
    adminid char(10)
);

-- 帖子表
drop table if exists forums;
create table forums(
	circleid char(10),
	forumid char(10) primary key,
	good int,
	star int,
	userid char(10),
	isofficial int,
	isrecommend int,
	istop int,
	content varchar(2000),
	title varchar(100),
	labels varchar(100)
);

-- 审核帖子表
drop table if exists nopublicforums;
create table nopublicforums(
	circleid char(10),
	forumid char(10) primary key,
	userid char(10),
	content varchar(2000),
	title varchar(100),
    ispublic int
);

-- 帖子一级回复表
drop table if exists forumcommentsone;
create table forumcommentsone(
	commentid char(10),
	forumid char(10),
	userid char(10),
	content varchar(2000),
	good int,
	star int,
	labels varchar(100)
);

-- 帖子二级回复表
drop table if exists forumcommentstwo;
create table forumcommentstwo(
	commentid char(10),
	rootid char(10),
	userid char(10),
	content varchar(2000),
    isreply int,
    replyuserid char(10),
    replyusername varchar(20)
);

-- 文本标签表
drop table if exists text_labels;
create table text_labels(
	circleid char(10),
	labelid char(10) primary key,
	text varchar(10)
);

-- 学习计划报表
drop table if exists plans;
create table plans(
	planid char(10) primary key,
	planname varchar(20),
	msg varchar(2000),
    labels varchar(200)
);

-- 学习计划部分表
drop table if exists plan_parts;
create table plan_parts(
	id int auto_increment primary key,
	planid char(10),
    partid int,
    partname varchar(20),
    msg varchar(2000)
);

-- 学习计划题目表
drop table if exists plan_problems;
create table plan_problems(
	id int auto_increment primary key,
	planid char(10),
    problemid char(10),
    part int,
    point int, 
    needpoints int
);

-- 用户学习计划表 
drop table if exists plan_users;
create table plan_users(
	id int auto_increment primary key,
    planid char(10),
    userid char(10),
    points int,
    isend int,
    finishproblemid varchar(1000)
);

drop table if exists users_messages;
create table users_messages(
	id int primary key auto_increment,
    userid char(10),
    receiveid char(10),
    message varchar(2000),
    time varchar(30),
    status int, -- 1表示已读,2表示未读 
    isreceive int,
    receivemessageid int null
);

drop table if exists users_friends;
create table users_friends(
	id int primary key auto_increment,
    userid char(10),
    friendid char(10)
);

drop table if exists users_shared;
create table users_shared(
	id int primary key auto_increment,
    userid char(10),
    content varchar(2000),
    time varchar(30)
);
