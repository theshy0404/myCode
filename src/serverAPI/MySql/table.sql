-- create database myCode;
use myCode;

drop table if exists users;
create table users(
	userid varchar(30) primary key,
	username varchar(30),
	password varchar(50),
	phone varchar(30) null,
	email varchar(30) null,
    emailtype int
);

drop table if exists emailtypes;
create table emailtypes(
	emailid int,
    emailname varchar(20)
);

insert into users(userid,username,password,phone,email,emailtype)values
('1318936142','足利上総三郎','4f4102e4a512eed639fac64d7d398b3a','19157708957','Aa1318936142',1);

insert into emailtypes(emailid,emailname)values
(1,'@163.com'),
(2,'@qq.com');