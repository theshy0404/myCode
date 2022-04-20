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
-- -- call doLoginProcedure('1318936142','wsyghhz2000');

drop procedure if exists select_problems;
delimiter $$
create procedure select_problems(
	$userid int,
	$isparams int,
	$problemname varchar(20),
	$typeid varchar(20),
	$rankid int,
	$labels varchar(200),
	$status int,
	$page int
)
begin
	declare $label varchar(20);
    declare $amount int;
    set $amount = ($page-1) * 6;
	if $userid = 0 
    then SET @sql1 = concat('select *,problem_rate(a.problemid) as rate,c.text as typetext,c.text as type2,d.text as type1 from problems a left join problemtypes c on a.typeid = c.typeid  join (select * from problemtypes where level =0) d on a.typeid like concat(\'%\',d.typeid,\'%\')');
    else 
    SET @sql1 = concat('select *,problem_rate(a.problemid) as rate,a.problemid as problemid,c.text as typetext,c.text as type2,d.text as type1 from problems a left join (select * from problemstatus where userid=\'',$userid,'\') b on a.problemid=b.problemid left join problemtypes c on a.typeid = c.typeid  join (select * from problemtypes where level =0) d on a.typeid like concat(\'%\',d.typeid,\'%\')');
    end if;
    if $isparams = 1
        Then set @sql1 = CONCAT(@sql1,' where a.problemid != \'0\'');
        if $problemname != 'all'
			Then set @sql1 = CONCAT(@sql1,'  and a.title like \'%',$problemname,'%\'');
		end if;
        if $typeid != '0'
			Then set @sql1 = CONCAT(@sql1,'  and a.typeid = \'',$typeid,'\'');
		end if;
        if $rankid != 0
			Then set @sql1 = CONCAT(@sql1,'  and a.rankid = ',$rankid);
		end if;
        if $labels != '0' Then
			while $labels <> '' do 
				set $label = substring_index($labels,',',1);
				set @sql1 = CONCAT(@sql1,' and a.labels like ',concat('\'%',$label,'%\''));
				set $labels = substring($labels,5);
			end while;
		end if;
        if $status != 0
			Then set @sql1 = CONCAT(@sql1,'  and b.status = ',$status);
		end if;
	end if;
    -- SET @sql1 = CONCAT(@sql1,'limit ',$amount,',6;');
    prepare s1 from  @sql1;  
	execute s1;  
    deallocate prepare s1;  
end $$
delimiter ;
-- -- call select_problems(1318936142,1,'all','0',0,'',0,1);

drop procedure if exists select_problems_admin;
delimiter $$
create procedure select_problems_admin(
	$userid int,
	$isparams int,
	$problemname varchar(20),
	$typeid varchar(20),
	$rankid int,
	$labels varchar(200),
	$status int
)
begin
	declare $label varchar(20);
	if $userid = 0 
    then SET @sql1 = concat('select *,c.text as type2,d.text as type1 from problems a left join problemtypes c on a.typeid = c.typeid join (select * from problemtypes where level =0) d on a.typeid like concat(\'%\',d.typeid,\'%\')');
    else 
    SET @sql1 = concat('select *,a.problemid as problemid,c.text as type2,d.text as type1 from problems a left join (select * from problemstatus where userid=\'',$userid,'\') b on a.problemid=b.problemid left join problemtypes c on a.typeid = c.typeid  join (select * from problemtypes where level =0) d on a.typeid like concat(\'%\',d.typeid,\'%\')');
    end if;
    if $isparams = 1
        Then set @sql1 = CONCAT(@sql1,' where a.problemid != \'0\'');
        if $problemname != 'all'
			Then set @sql1 = CONCAT(@sql1,'  and a.title like \'%',$problemname,'%\'');
		end if;
        if $typeid != '0'
			Then set @sql1 = CONCAT(@sql1,'  and a.typeid = \'',$typeid,'\'');
		end if;
        if $rankid != 0
			Then set @sql1 = CONCAT(@sql1,'  and a.rankid = ',$rankid);
		end if;
        if $labels != '0' Then
			while $labels <> '' do 
				set $label = substring_index($labels,',',1);
				set @sql1 = CONCAT(@sql1,' and a.labels like ',concat('\'%',$label,'%\''));
				set $labels = substring($labels,5);
			end while;
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
-- -- call select_problems_admin(1318936142,1,'all','0',0,'',0);

drop procedure if exists select_problemtypes;
delimiter $$
create procedure select_problemtypes($typeid char(10))
begin
	if $typeid = '0' 
		then select * from problemtypes where level = 1;
	else select * from problemtypes where level = 1 and typeid like concat($typeid,'%');
    end if;
end $$
delimiter ;
-- -- call select_problemtypes('A');

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
-- -- call select_label('21');

drop procedure if exists problem_detail;
delimiter $$
create procedure problem_detail($problemid char(10))
begin
	select a.*,b.text as type from problems a join problemtypes b on a.typeid=b.typeid where a.problemid = $problemid ;
end $$
delimiter ;
-- -- call problem_detail('9516613633');

drop procedure if exists problem_replys;
delimiter $$
create procedure problem_replys($problemid char(10))
begin
	select * from replys a 
    left join users b on a.userid=b.userid
    where a.problemid = $problemid;
end $$
delimiter ;
-- -- call problem_replys('1318936142');

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
-- -- call reply_comments('1318936142');

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
-- -- call add_reply_comment('3112187283','1318936142','1318936142','1318936142','dddss');

drop procedure if exists add_code_submit;
delimiter $$
create procedure add_code_submit(
	$problemid char(10),
    $userid char(10),
    $codes varchar(2000),
    $language int,
    $status int
)
begin
	insert into submitItems(problemid,userid,createtime,codes,language,status)value
    ($problemid,$userid,now(),$codes,$language,$status);
    select count(id) into @count from problemstatus where problemid = $problemid and userid = $userid;
    if @count = 1 then
		update problemstatus set status = $status where problemid = $problemid and userid = $userid;
    else 
		insert into problemstatus(problemid,userid,status)value
        ($problemid,$userid,$status);
    end if;
end $$
delimiter ;
-- -- call add_code_submit('1318936142','1155883111','1776882861',3,1);

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
-- -- call get_code_submit('3799832425','1318936142');

drop procedure if exists get_solutions;
delimiter $$
create procedure get_solutions(
	$problemid char(10)
)
begin
	select * from solutions where problemid = $problemid and isPublic=1;
end $$
delimiter ;
-- -- call get_solutions('1318936142');

drop procedure if exists get_solution;
delimiter $$
create procedure get_solution(
	$solutionid char(10)
)
begin
	select * from solutions where solutionid = $solutionid;
end $$
delimiter ;
-- -- call get_solution('1318936142');

drop procedure if exists get_solution_labels;
delimiter $$
create procedure get_solution_labels()
begin
	select languageid as value,text as label from languages
    union all
    select labelid as value,text as label from problemlabels;
end $$
delimiter ;
-- -- call get_solution_labels();

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
-- -- call get_label_solutions('1318936142','2',11);

drop procedure if exists add_problem_solution;
delimiter $$
create procedure add_problem_solution(
	$solutionid char(10),
    $problemid char(10),
    $isofficial int,  
    $userid char(10),
    $title varchar(50),
    $language int,
    $content varchar(2000),
    $code varchar(2000),
    $labels varchar(20)
)
begin
	insert into solutions(solutionid,problemid,isofficial,userid,title,good,language,createtime,hasCode,content,code,labels,isPublic)values
	($solutionid,$problemid,$isofficial,$userid,$title,0,$language,now(),1,$content,$code,$labels,1);
end $$
delimiter ;
-- -- call add_problem_solution();

drop procedure if exists get_problem_labels;
delimiter $$
create procedure get_problem_labels()
begin
	select labelid as value,text as label from problemlabels;
end $$
delimiter ;
-- call get_problem_labels();

drop procedure if exists add_problem;
delimiter $$
create procedure add_problem(
	$problemid char(10),
    $title varchar(20),
    $msg varchar(5000),
    $input varchar(2000) ,
    $output varchar(2000) ,
    $rankid int,
    $labels varchar(50),
    $typeid varchar(10),
    $func varchar(30) ,
    $arguements varchar(20) ,
    $template varchar(300) 
)
begin
	insert into problems(problemid,title,msg,input,output,rankid,labels,typeid,createtime,func,arguements,template)values
	($problemid,$title,$msg,$input,$output,$rankid,$labels,$typeid,now(),$func,$arguements,$template);
end $$
delimiter ;
-- -- call add_problem();

drop procedure if exists edit_problem;
delimiter $$
create procedure edit_problem(
	$problemid char(10),
    $title varchar(20),
    $msg varchar(5000),
    $input varchar(2000) ,
    $output varchar(2000) ,
    $rankid int,
    $labels varchar(50),
    $typeid varchar(10),
    $func varchar(30) ,
    $arguements varchar(20) ,
    $template varchar(300) 
)
begin
	update problems set title = $title,msg=$msg,input=$input,output=$output,rankid=$rankid,labels=$labels,typeid=$typeid
    ,func=$func,arguements=$arguements,template=$template where problemid=$problemid;
end $$
delimiter ;
-- -- call edit_problem();

drop procedure if exists get_circles;
delimiter $$
create procedure get_circles(
	$parentid char(10),
	$userid char(10)
)
begin
	if $parentid ='0' then
		select 'mine' as circleid,'我加入的圈子' as circlename,1 as hasChildren 
        union all
		select circleid,circlename,hasChildren from circles where hasChildren = 1 and ispublic=1;
	elseif $parentid = '1' then 
        select *,if(circleid in (select circleid from user_circles where userid = $userid),1,0) as isjoin from circles where hasChildren=0 and ispublic=1;
	elseif $parentid = 'mine' then 
		select * from circles a 
        join user_circles b on a.circleid=b.circleid
        where a.hasChildren = 0 and b.userid = $userid and a.ispublic=1;
	else
		select * from circles where parentid = $parentid and ispublic=1;
	end if;
end $$
delimiter ;
-- -- call get_circles('0');-- call get_circles('mine');

drop procedure if exists get_forums;
delimiter $$
create procedure get_forums(
	$circleid char(10)
)
begin
	select a.*,b.username from forums a
    join users b on a.userid = b.userid
    where circleid = $circleid;
end $$
delimiter ;
-- -- call get_forums('1318936143');

drop procedure if exists get_forum;
delimiter $$
create procedure get_forum(
	$forumid char(10)
)
begin
	select a.*,b.username from forums a
    join users b on a.userid = b.userid
    where forumid = $forumid;
end $$
delimiter ;
-- -- call get_forum('1259578256');

drop procedure if exists get_forum_comment;
delimiter $$
create procedure get_forum_comment(
	$forumid char(10)
)
begin
	select a.*,b.username from forumcommentsone a
    join users b on a.userid = b.userid
    where forumid = $forumid;
end $$
delimiter ;
-- -- call get_forum_comment('1318936142');

drop procedure if exists get_forum_comment_comment;
delimiter $$
create procedure get_forum_comment_comment(
	$commentid char(10)
)
begin
	select a.*,b.username from forumcommentstwo a
    join users b on a.userid = b.userid
    where rootid = $commentid;
end $$
delimiter ;
-- -- call get_forum_comment_comment('1318936142');

drop procedure if exists add_forum;
delimiter $$
create procedure add_forum(
	$circleid char(10),
	$forumid char(10),
	$userid char(10),
	$isofficial int,
	$content varchar(2000),
	$title varchar(100),
	$labels varchar(100)
)
begin
	insert into forums(circleid,forumid,good,star,userid,isofficial,isrecommend,istop,content,title,labels)values
	($circleid,$forumid,0,0,$userid,$isofficial,0,0,$content,$title,$labels);
	select * from forums where circleid = $circleid;
end $$
delimiter ;

drop procedure if exists get_forum_info;
delimiter $$
create procedure get_forum_info(
	$forumid char(10)
)
begin
	select a.forumid,a.title,a.content,b.username from forums a
    join users b on a.userid=b.userid where forumid = $forumid;
end $$
delimiter ;
-- -- call get_forum_info('1318936142');

drop procedure if exists get_comment_info;
delimiter $$
create procedure get_comment_info(
	$commentid char(10)
)
begin
	select a.content,b.username from forumcommentsone a
    join users b on a.userid=b.userid 
    where commentid = $commentid ;
end $$
delimiter ;
-- -- call get_comment_info('1318936142');

drop procedure if exists get_circle_labels;
delimiter $$
create procedure get_circle_labels(
	$circleid char(10)
)
begin
	select labelid as id,text as label from text_labels where circleid = $circleid;
end $$
delimiter ;
-- -- call get_circle_labels('1318936143');

drop procedure if exists add_circle_label;
delimiter $$
create procedure add_circle_label(
	$circleid char(10),
    $labelid char(10),
    $text varchar(100)
)
begin
	insert into text_labels(circleid,labelid,text)values
	($circleid,$labelid,$text);
end $$
delimiter ;
-- -- call add_circle_label('1318936143','1318936142');

drop procedure if exists get_circle_label;
delimiter $$
create procedure get_circle_label(
	$circleid char(10),
    $labelid char(10)
)
begin
	select * from text_labels where circleid = $circleid and labelid = $labelid;
end $$
delimiter ;
-- -- call get_circle_label('1318936143','1318936142');

drop procedure if exists get_labels_forums;
delimiter $$
create procedure get_labels_forums(
	$circleid char(10),
    $labelid char(10)
)
begin
	select forumid,title,content from forums where circleid = $circleid and labels like concat('%',$labelid,'%');
end $$
delimiter ;
-- -- call get_labels_forums('1318936143','1318936142');

drop procedure if exists get_problem_types;
delimiter $$
create procedure get_problem_types()
begin
	select * from problemtypes;
end $$
delimiter ;
-- call get_problem_types();

drop procedure if exists delete_problem;
delimiter $$
create procedure delete_problem($problemid varchar(10))
begin
	delete from problems where problemid=$problemid;
end $$
delimiter ;

drop procedure if exists get_problem_info;
delimiter $$
create procedure get_problem_info($problemid char(10))
begin
	select * from problems where problemid = $problemid;
end $$
delimiter ;
-- -- call get_problem_info('3799832425');

drop procedure if exists problem_submit_note;
delimiter $$
create procedure problem_submit_note(
	$submitid int,
	$problemid char(10),
    $userid char(10),
    $note varchar(200)
)
begin
	update submitItems set note = $note where problemid = $problemid and userid = $userid and submitid = $submitid;
end $$
delimiter ;
-- -- call get_code_submit('3799832425','1318936142');

drop procedure if exists user_circles;
delimiter $$
create procedure user_circles(
	$circleid char(10),
    $userid char(10)
)
begin
	update circles set fans = fans + 1 where circleid = $circleid;
    insert user_circles(circleid,userid,point,jointime)values
    ($circleid,$userid,0,now());
end $$
delimiter ;

drop procedure if exists add_circles;
delimiter $$
create procedure add_circles(
	$circleid char(10),
	$circlename varchar(20),
	$msg varchar(2000),
	$parentid char(10),
	$hasChildren int,
    $creater char(10),
    $fans int,
    $ispublic int
)
begin
	insert into circles(circleid,circlename,msg,parentid,hasChildren,createtime,creater,fans,ispublic)values
    ($circleid,$circlename,$msg,$parentid,$hasChildren,now(),$creater,$fans,$ispublic);
end $$
delimiter ;

drop procedure if exists get_learn_plan;
delimiter $$
create procedure get_learn_plan()
begin
	select *,plan_rate(planid) as rate from plans;
end $$
delimiter ;

drop procedure if exists get_plan_problems;
delimiter $$
create procedure get_plan_problems()
begin
	select problemid,title as problemname,concat(b.text,'-',title) as problem,b.text as ranktext
    from problems a join problemranks b on a.rankid=b.rankid;
end $$
delimiter ;

drop procedure if exists get_learn_plan;
delimiter $$
create procedure get_learn_plan()
begin
	select *,plan_rate(planid) as rate from plans;
end $$
delimiter ;

drop procedure if exists add_learn_plan;
delimiter $$
create procedure add_learn_plan(
	$planid char(10),
	$planname varchar(20),
	$msg varchar(2000),
    $labels varchar(200)
)
begin
	insert into plans(planid,planname,msg,labels)values
    ($planid,$planname,$msg,$labels);
end $$
delimiter ;

drop procedure if exists add_plan_problem;
delimiter $$
create procedure add_plan_problem(
	$planid char(10),
    $problemid char(10),
    $part int,
    $point int,
    $needpoints int
)
begin
	insert into plan_problems(planid,problemid,part,point,needpoints)values
    ($planid,$problemid,$part,$point,$needpoints);
end $$
delimiter ;

drop procedure if exists add_user_plan;
delimiter $$
create procedure add_user_plan(
	$userid char(10),
    $planid char(10)
)
begin
	insert into plan_users(planid,userid,points,isend,finishproblemid)value
    ($planid,$userid,0,0,'');
    call get_user_plan($userid);
end $$
delimiter ;

drop procedure if exists get_user_plan;
delimiter $$
create procedure get_user_plan(
	$userid char(10)
)
begin
	select *,round(b.points/plan_amount(b.planid)*100) as rate from plans a  
    join plan_users b 
    on a.planid = b.planid
    where b.userid=$userid;
end $$
delimiter ;

drop procedure if exists get_plan_detail;
delimiter $$
create procedure get_plan_detail(
	$planid varchar(10),
    $userid varchar(10)
)
begin
	select count(userid) into @n from plan_users where planid=$planid;
    select points into @points from plan_users where planid=$planid and userid = $userid;
	select *,@n as count,@points as pounts,round(@points/plan_amount(planid),2)*100 as rate from plans where planid=$planid;
end $$
delimiter ;
call get_plan_detail('4579326183','1318936142');

drop procedure if exists get_problem_label;
delimiter $$
create procedure get_problem_label(
	$labelid char(4)
)
begin
	select * from problemlabels where labelid = $labelid;
end $$
delimiter ;
-- call get_problem_label('001');

drop procedure if exists get_plan_problems;
delimiter $$
create procedure get_plan_problems(
	$planid varchar(10),
    $userid varchar(10)
)
begin
	select points into @points from plan_users where planid=$planid and userid = $userid;
	select a.*,problem_rate(a.problemid) as problemrate,b.title as problemname ,b.rankid,if(@points>=a.needpoints,0,1) as isdisabled
    from plan_problems a
    join problems b on a.problemid=b.problemid
    where planid=$planid
    order by part,needpoints;
end $$
delimiter ;
-- call get_plan_problems('4579326183','1318936142');

drop procedure if exists add_plan_user_problem;
delimiter $$
create procedure add_plan_user_problem(
	$planid varchar(10),
    $userid varchar(10),
    $problemid varchar(10)
)
begin
	select count(finishproblemid) into @count from plan_users 
    where userid = $userid and planid = $planid and finishproblemid like concat('%',$problemid,'%');
    select point into @point from plan_problems where planid = $planid and problemid = $problemid;
    if @count = 0 then
		update plan_users set 
        finishproblemid = concat(finishproblemid,',',$problemid),
        points = points + @point
        where userid = $userid and planid = $planid ;
    end if;
end $$
delimiter ;
-- call get_plan_problems('4579326183','1318936142');
