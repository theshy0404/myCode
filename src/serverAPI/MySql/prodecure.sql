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
-- call doLoginProcedure('1318936142','wsyghhz2000');

drop procedure if exists select_problems;
delimiter $$
create procedure select_problems(
	$userid int,
	$isparams int,
	$problemname varchar(20),
	$typeid int,
	$rankid int,
	$labelid int,
	$status int
)
begin
	if $userid = 0 
    then SET @sql1 = concat('select * from problems');
    else 
    SET @sql1 = concat('select *,a.problemid as problemid from problems a 
	left join (select * from problemstatus where userid=\'',$userid,'\') b on a.problemid=b.problemid');
    end if;
    if $isparams = 1
        Then set @sql1 = CONCAT(@sql1,' where a.problemid != \'0\'');
        if $problemname != 'all'
			Then set @sql1 = CONCAT(@sql1,'  and a.title like \'%',$problemname,'%\'');
		end if;
        if $typeid != 0
			Then set @sql1 = CONCAT(@sql1,'  and a.type = ',$typeid);
		end if;
        if $rankid != 0
			Then set @sql1 = CONCAT(@sql1,'  and a.rankid = ',$rankid);
		end if;
        if $labelid != 0
			Then set @sql1 = CONCAT(@sql1,'  and a.labelid = ',$labelid);
		end if;
        if $status != 0
			Then set @sql1 = CONCAT(@sql1,'  and b.status = ',$status);
		end if;
	end if;
    SET @sql1 = CONCAT(@sql1,';');
    prepare s1 from  @sql1;  
	execute s1;  
    deallocate prepare s1;  
end $$
delimiter ;
-- call select_problems(0,0,'all',0,0,0,0);

drop procedure if exists select_problemlabels;
delimiter $$
create procedure select_problemlabels($typeid int)
begin
	if $typeid = 0 
		then select * from problemlabels;
	else select * from problemlabels where typeid = $typeid;
    end if;
end $$
delimiter ;
-- call select_problemlabels('2');

drop procedure if exists select_label;
delimiter $$
create procedure select_label($labelid int)
begin
	if $labelid = 0 
		then select * from problemlabels;
	else select * from problemlabels where labelid = $labelid;
    end if;
end $$
delimiter ;
-- call select_label('21');

drop procedure if exists problem_detail;
delimiter $$
create procedure problem_detail($problemid char(10))
begin
	select *,b.text as label,c.text as type from problems a 
    join problemlabels b on a.labelid=b.labelid
    join problemtypes c on c.typeid=a.type
    where a.problemid = $problemid;
end $$
delimiter ;
-- call problem_detail('1318936142');

drop procedure if exists problem_replys;
delimiter $$
create procedure problem_replys($problemid char(10))
begin
	select * from replys a 
    left join users b on a.userid=b.userid
    where a.problemid = $problemid;
end $$
delimiter ;
-- call problem_replys('1318936142');

drop procedure if exists reply_comments;
delimiter $$
create procedure reply_comments($replyid char(10))
begin
    select a.*,b.*,c.username as replyname from replycomments a 
    left join users b on a.userid=b.userid
    left join users c on a.replyuserid=c.userid
    where a.replyid = $replyid;
end $$
delimiter ;
-- call reply_comments('1318936142');

drop procedure if exists add_reply_comment;
delimiter $$
create procedure add_reply_comment(
	$commentid char(10),
	$replyid char(10),
    $userid char(10),
    $replyuserid char(10),
    $content varchar(200)
)
begin
	insert into replycomments(commentid,replyid,userid,replyuserid,content,createtime)values
    ($commentid,$replyid,$userid,$replyuserid,$content,now());
    update replys set commentCount = commentCount +1 where replyid = $replyid;
end $$
delimiter ;
-- call add_reply_comment('3112187283','1318936142','1318936142','1318936142','dddss');

drop procedure if exists add_code_submit;
delimiter $$
create procedure add_code_submit(
	$problemid char(10),
	$submitid char(10),
    $userid char(10),
    $language int,
    $status int
)
begin
	declare $count int;
	insert into submitItems(problemid,submitid,userid,createtime,language,status)values
    ($problemid,$submitid,$userid,now(),$language,$status);
    set $count = (select count(status) from problemstatus where userid = $userid and problemid = $problemid);
    SET SQL_SAFE_UPDATES = 0;
    if $count = 1 then 	
		update problemstatus set status = $status where problemid=$problemid and userid = $userid;
	end if;
    if $count != 1 then 	
		insert into problemstatus(problemid,userid,status)values
		($problemid,$userid,$status);
    end if;
end $$
delimiter ;
-- call add_code_submit('1318936142','1155883111','1776882861',3,1);

drop procedure if exists get_code_submit;
delimiter $$
create procedure get_code_submit(
	$problemid char(10),
    $userid char(10)
)
begin
	select * from submititems a
    join problems b on a.problemid=b.problemid
    where a.userid=$userid and a.problemid=$problemid
    order by a.createtime desc;
end $$
delimiter ;
-- call get_code_submit('1318936142','1318936142');

drop procedure if exists get_solution;
delimiter $$
create procedure get_solution(
	$problemid char(10)
)
begin
	select * from solutions where problemid = $problemid;
end $$
delimiter ;
-- call get_solution('1318936142');

drop procedure if exists get_solution_labels;
delimiter $$
create procedure get_solution_labels()
begin
	select languageid as value,text as label from languages
    union all
    select labelid as value,text as label from problemlabels;
end $$
delimiter ;
-- call get_solution_labels();

drop procedure if exists get_label_solutions;
delimiter $$
create procedure get_label_solutions(
	$problemid char(10),
	$language int,
	$label int
)
begin
    SET @sql1 = concat('select * from solutions where problemid = \'',$problemid,'\'');
    if $language != 0
		Then set @sql1 = CONCAT(@sql1,' and language = ',$language,'');
	end if;
    if $label != 0
		Then set @sql1 = CONCAT(@sql1,' and labels like \'%',$label,'%\'');
	end if;
    SET @sql1 = CONCAT(@sql1,';');
    prepare s1 from  @sql1;  
	execute s1;  
    deallocate prepare s1;  
end $$
delimiter ;
call get_label_solutions('1318936142','2',11);