select * from users;
drop procedure if exists doLoginProcedure;
delimiter $$
create procedure doLoginProcedure(
 $user varchar(30),
 $password varchar(50)
)
begin
 declare $count int;
    declare $code varchar(20);
    #找出该账户的记录
 select count(userid) into $count from users where userid = $user or username = $user;
    
    #有记录，表示用户存在(md5是对数据进行加密)
    if $count = 1 then
  select count(userid) into $count from users where (userid = $user or username = $user) and password = md5($password);
  #用户名密码都存在且为同一条记录，返回登录成功
  if $count = 1 then 
   select userid,username from users where (userid = $user or username = $user) and password = md5($password);
  #用户名存在但密码对不上，返回密码错误
  else
    set $code = '0403';
             select $code as code;
  end if;
 #用户不存在，返回账号或用户名不存在
 else
  set $code = '0404';
        select $code as code;
 end if;
end $$
delimiter ;
call doLoginProcedure('1318936142','wsyghhz2000');
