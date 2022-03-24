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
    then SET @sql1 = concat('select * from problems a');
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

drop procedure if exists select_problemtypes;
delimiter $$
create procedure select_problemtypes($typeid int)
begin
	if $typeid = '0' 
		then select * from problemtypes where level = 1;
	else select * from problemtypes where level = 2 and typeid like concat($typeid,'%');
    end if;
end $$
delimiter ;
call select_problemtypes('0');

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
    left join problemlabels b on a.labelid=b.labelid
    left join problemtypes c on c.typeid=a.type
    where a.problemid = $problemid;
end $$
delimiter ;
-- call problem_detail('6011480004');

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

drop procedure if exists get_solutions;
delimiter $$
create procedure get_solutions(
	$problemid char(10)
)
begin
	select * from solutions where problemid = $problemid and isPublic=1;
end $$
delimiter ;
-- call get_solutions('1318936142');

drop procedure if exists get_solution;
delimiter $$
create procedure get_solution(
	$solutionid char(10)
)
begin
	select * from solutions where solutionid = $solutionid;
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
-- call get_label_solutions('1318936142','2',11);

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
-- call add_problem_solution();

drop procedure if exists add_problem;
delimiter $$
create procedure add_problem(
	$problemid char(10),
    $title varchar(20),
    $msg varchar(500),
    $input1 varchar(20),
    $input2 varchar(20),
    $output1 varchar(20),
    $output2 varchar(20),
    $rankid int,
    $labelid int,
    $type int,
    $isSQL int,
    $func varchar(30),
    $arguements varchar(30)
)
begin
	insert into problems(problemid,title,msg,input1,input2,output1,output2,rankid,labelid,type,isSQL,createtime,func,arguements,template,replyCount)values
	($problemid,$title,$msg,$input1,$input2,$output1,$output2,$rankid,$labelid,$type,$isSQL,now(),$func,$arguements,'',0);
end $$
delimiter ;
-- call add_problem();

drop procedure if exists edit_problem;
delimiter $$
create procedure edit_problem(
	$problemid char(10),
    $title varchar(20),
    $msg varchar(500),
    $input1 varchar(20),
    $input2 varchar(20),
    $output1 varchar(20),
    $output2 varchar(20),
    $rankid int,
    $labelid int,
    $type int,
    $isSQL int,
    $func varchar(30),
    $arguements varchar(30)
)
begin
	update problems set 
    title = $title,msg = $msg,input1 = $input1,
    input2 = $input2,output1 = $output1,output2 = $output2,
    rankid = $rankid,labelid = $labelid,type = $type,
    isSQL = $isSQL,func = $func,arguements = $arguements
    where problemid = $problemid;
end $$
delimiter ;
-- call edit_problem();
-- select * from problems;
-- call add_problem('8143116617','两数积','给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标.你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现.你可以按任意顺序返回答案','1,3','1,2','3','2',1,11,1,0,'twoProduct','a,b');


drop procedure if exists get_circles;
delimiter $$
create procedure get_circles(
	$parentid char(10)
)
begin
	if $parentid !='0' then
		select * from circles where parentid = $parentid;
	else
		select * from circles;
	end if;
end $$
delimiter ;
-- call get_circles('0');

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
-- call get_forums('1318936143');

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
-- call get_forum('1259578256');

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
-- call get_forum_comment('1318936142');

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
-- call get_forum_comment_comment('1318936142');

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
-- call get_forum_info('1318936142');

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
-- call get_comment_info('1318936142');

drop procedure if exists get_circle_labels;
delimiter $$
create procedure get_circle_labels(
	$circleid char(10)
)
begin
	select labelid as id,text as label from text_labels where circleid = $circleid;
end $$
delimiter ;
-- call get_circle_labels('1318936143');

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
-- call add_circle_label('1318936143','1318936142');

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
-- call get_circle_label('1318936143','1318936142');

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
-- call get_labels_forums('1318936143','1318936142');

drop procedure if exists update_rows;
DELIMITER $$
CREATE PROCEDURE update_rows(   #插入或修改多行行记录
	$database varchar(255),    -- 数据库名称
	$tablename varchar(255),   -- 表名  
	$keyfield varchar(500),    -- 主键列名
	$sortfield varchar(255),   -- 排序列
	$data MediumText           -- json数组,多条记录
)
begin
	declare $sql1, $sql2, $sql3, $sql4, $sql5, $sql6, $sql7, $selectsql, $row, $json, $value mediumtext default '';
	declare $field, $type, $datatype, $autofield, $action, $extra, $key, $treefield, $s varchar(255) default '';
    declare $parentnodevalue varchar(255);   -- 当前节点的父节点的值
    declare $j, $treeflag, $isreadonly, $isautoflag, $reloadrow, $level int default 0;
    # treeflag判断是否是树形结构, $isreadonly判断列是否只读, $isautoflag是否存在自增列, $reloadrow是否需要重新家在数据
    set $database=if($database='', 'imlab2020', $database); #默认数据库为kms2020
    set @quot1=Char(127 USING utf8mb4);  #前台传递数据时单引号的替代符
    set @quot2=concat(@quot1, @quot1);   #前台传递数据时双引号的替代符
    set @fieldset='', @keyfield='', @sortfield='', @autorowid=-1;
    #@autorowid新增记录后最大的自增列;
    set @data=replace($data, @quot2,'\\\"');
    #select @data;
    call sys_GetColumnset($database, $tablename, @fieldset); # 获取表中所有列信息
    #set $tablename=concat($database,'.', $tablename);
    set $row=json_extract($data, '$[0]');
    set $selectsql=concat('select * from ', $tablename);
	set $reloadrow=sys_GetJsonValue($row, '_reloadrow', 'n');  #是否重新加载数据
	set $action=sys_GetJsonValue($row, '_action', 'c');  #数据增删改类型add\replace\update\delete
    set $action=if($action='', 'replace', $action);
   	set $treeflag=sys_GetJsonValue($row, '_treeflag', 'n');  #记录树形结构的关键字
   	set $treefield=sys_GetJsonValue($row, '_treefield', 'c');  #记录树形结构的关键字
    if ($treefield<>'' and $treeflag=0) then set $treeflag=1; end if;
	set $treefield=if($treefield='', $keyfield, $treefield);
    set sql_safe_updates=0;
    set $keyfield=concat(';', $keyfield, ';');
    #提取每一个列病进行判断处理
    set $j=0;
    while $j<json_length(@fieldset) do
		set $json=json_extract(@fieldset, concat('$[', $j, ']'));
		set $field=sys_GetJsonValue($json, 'field', 'c');
		set $type=sys_GetJsonValue($json, 'type', 'c');
        #对于date,datetime,time,timestamp数据类型，$.取值可能会出错，故此改成varchar(50)
        set $type=if($type in('date','datetime','time','timestamp'), 'varchar(50)', $type);
        #对于json数据类型，数据格式会变化，故此改成mediumtext
        #set $type=if($type='json', 'mediumtext', $type);
		set $datatype=sys_GetJsonValue($json, 'datatype', 'c');
		set $key=sys_GetJsonValue($json, 'key', 'c');
		set $extra=sys_GetJsonValue($json, 'extra', 'c');
        set $isreadonly=0;
        if ($extra='auto_increment') then
			#自增列如果其值为<0，则不编辑这个值。等于0时，replace语句会自动添加值
			set $autofield=$field;
            set @autorowid=sys_GetJsonValue($row, $autofield, 'n');
            #select 11111,@autorowid;
			if (@autorowid<=0) then set $isreadonly=1; end if;
		elseif (right($extra, 9)='generated') then set $isreadonly=1; #计算列不编辑
		end if;
        #判断是否是树形结构
        if ($field in ('parentnodeid','isparentflag','level','ancester')) then 
			set $treeflag=$treeflag+1; 
		end if;
		if ($isreadonly=0) then
			if ($sql1<>'') then
				set $sql1=concat($sql1,',');   #列出replace语句中的列名
            end if;
            set $sql1=concat($sql1, $field);
            #select $datatype,$field, $type;
			#确定replace语句之后批量提取数据的select语句部分。
            #如果是删除记录，只提取主键部分的列+树结构的ancester列，而其他操作时都提取这些列。
            if ($action<>'delete' or $key='pri' or locate(concat(';', $field, ';'), $keyfield)>0 or $field='ancester') then
				if ($sql3<>'') then
					set $sql2=concat($sql2,',');   #提取json数据$.???
					set $sql3=concat($sql3,','); 
                end if;
                if ($datatype='n') then 
					set $sql2=concat($sql2, $field, ' varchar(255) path "$.', $field, '"');  #将数值型数据类型变成varchar(255)，避免空值的处理
                else
					set $sql2=concat($sql2, $field, ' ', $type, ' path "$.', $field, '"');   #其他数据类型不变
                end if;
				if ($datatype='date') then
					set $sql3=concat($sql3, concat("if(", $field,"='', '1900-01-01',", $field, ")")); #替换日期型数据中的空值
					set $sql3=concat($sql3, ' as ', $field);
				elseif ($datatype='time') then
					set $sql3=concat($sql3, concat("if(", $field,"='', '00:00',", $field, ")")); #替换时间型数据中的空值
					set $sql3=concat($sql3, ' as ', $field);
				elseif ($datatype='n') then
					set $sql3=concat($sql3, "if(", $field,"='', 0, ", $field,")"); #替换数值型中的空值
					set $sql3=concat($sql3, ' as ', $field);
				else
					#trim(both '"' from cast(json_extract(field1, '$.t_value') as char))
					#set $sql3=concat($sql3, concat('replace(replace(', $field,', @quot2,\'"\'), @quot1,"\'")')); #替换单引号与双引号
					set $sql3=concat($sql3, $field); 
				end if;
				#set $sql3=concat($sql3, concat('replace(replace(', $field,', @quot2,\'"\'), @quot1,"\'")')); #替换单引号与双引号
				#set $sql3=concat($sql3, ' as ', $field);
            end if;
            #sql4为update语句set中的列名，例如：set a.f1=b.f1
            if ($key<>'pri' and sys_GetJsonValue($row, $field, '') is not null) then            
				if ($sql4<>'') then
					set $sql4=concat($sql4,',');   #update语句中的set子句
				end if;
				set $sql4=concat($sql4, ' a.', $field, '=b.', $field);  
            end if;
		end if; ## if readonly		
		#根据主键确定update/delete中的where条件
		if ($key='pri' or locate(concat(';', $field, ';'), $keyfield)>0) then
			#sql5为查询第一条记录的where条件，sql6为update的where条件,sql7为删除记录的where条件,sql8为删除记录时需要提取的列（比sql3要少，但格式与sql3相同）
			if ($sql5<>'') then 
				set $sql5=concat($sql5,' and '); 
				set $sql6=concat($sql6,' and '); 
				set $sql7=concat($sql7,' and '); 
			end if;
			set $s=sys_GetJsonValue($row, $field, 'c');
			set $sql5=concat($sql5, $field,"='", $s, "'");
			set $sql6=concat($sql6, 'a.', $field, '=b.', $field);
			set $sql7=concat($sql7, $field,' in (select ', $field, ' from tmp)');
			set @sortfield=concat(@sortfield, ',', $field); 
		end if;
		set $j=$j+1;
	end while;
	set @sql=concat(' with tmp as (select * from json_table(@data, \'$[*]\' columns (', $sql2, ') ) as p)');
	#set @sql=concat(" with tmp as (select * from json_table('", @data,"', '$[*]' columns (", $sql2, ") ) as p)");
	#提取数据
    if ($sortfield<>'') then set @sortfield=replace($sortfield,';',',');
    else set @sortfield=substring(@sortfield, 2);
    end if;
    set @n=0;
    if ($action='add' and $keyfield<>'' and locate(concat(';', $autofield, ';'), $keyfield)=0) then
		#新增记录时判断主键是否重复
		#select $keyfield,$autofield;
		set @sqlx=concat('select count(*) into @n from ', $tablename,' where ', $sql5);
		prepare stmt from @sqlx;
		execute stmt;
    end if;
    if (@n=0) then
		if ($action='delete') then
			set @sqlx=concat(@sql, ' delete a from ', $tablename,' as a join tmp as b on a.ancester like concat(trim(b.ancester), trim(b.', $treefield,'),"#%")');
			set @sql=concat(@sql, ' delete a from ', $tablename,' as a join tmp as b on ', $sql6);
			#删除树的子节点
			if ($treeflag>4) then
				#select @sqlx;
				prepare stmt from @sqlx;
				execute stmt;
			end if;
		elseif ($action='update') then ##修改记录
			set @sql=concat(@sql, ' update ', $tablename, ' as a join (select ', $sql3, ' from tmp) as b');
			set @sql=concat(@sql, ' set ', $sql4, ' where ', $sql6);
		else
			set @sql=concat('replace into ', $tablename, '(', $sql1, ')', @sql, ' select ', $sql3, ' from tmp');
		end if;
		#select @sql; #执行数据增删改操作sssssssssss
		prepare stmt from @sql;   
		execute stmt;
        #select $treeflag,$action;
		#数据增删改操作之后，处理树形结构问题（要求树形结构实现计算出level,ancester值，新增节点时将父节点的isparentflag设置为1
		if ($treeflag>4) then
			#set $treefield=if($treefield='', $keyfield, $treefield);
			#select $treefield;        
			set $s=sys_GetJsonValue($row, $treefield, 'c');
			set $parentnodevalue=sys_GetJsonValue($row, 'parentnodeid', 'c');
			set $level=sys_GetJsonValue($row, 'level', 'n');
			if ($action='add' or $action='replace') then
				set @sql=concat('update ', $tablename ,' set isparentflag=1 where isparentflag=0 and level=', $level-1, ' and ', $treefield,'="', $parentnodevalue, '"');
				#select @sql;
				prepare stmt from @sql;
				EXECUTE stmt;
			elseif ($action='delete') then
				set @sql=concat("with tmp as (select * from ", $tablename,") update ", $tablename, " as a set isparentflag=0 ");
				set @sql=concat(@sql, " where ", $treefield, "='", $parentnodevalue, "' and not exists (select 1 from tmp where tmp.parentnodeid=a.", $treefield,")");
				#select 'delenode', $treefield, @sql;
				prepare stmt from @sql;
				EXECUTE stmt;
			end if;
		end if;
		#取回最近操作的行
		set @selectsql="";
		if ($action<>'delete' and $reloadrow>0) then
			if ($autofield<>'') then #自增列不为空的时候
				if ($action='add') then set @autorowid=LAST_INSERT_ID(); #新增记录时取第一行值
				else set @autorowid=sys_GetJsonValue($row, $autofield, 'n'); #修改记录时取第一行值
				end if;
			end if;
			if (@autorowid>0) then set $sql5=concat($autofield, "=", @autorowid); end if;
			#select  @sortfield,$autofield,@autorowid,$sql5;
			if ($sql5<>'') then
				set @sql=concat('with tmp1 as (', $selectsql, '),');
				set @sql=concat(@sql, 'tmp2 as (select *, row_number() over(order by ', @sortfield,') as rowno from tmp1)');
				set @sql=concat(@sql, 'select rowno into @rowno from tmp2 where ', $sql5);
				#select @sql as rownosql;
				prepare stmt from @sql;   
				execute stmt;
				set @selectsql=concat("select *, ", @rowno," as '_rowno' from (", $selectsql, " where ", $sql5,") as p") ;
			end if;
		else
			#set @selectsql=concat("select '' as _error, 1 as flag,", @autorowid," as ", @autorowid); 
			set @selectsql=concat("select '' as _error, 1 as flag,", @autorowid," as ", '_autorowid');   #20220219改@autorowid
		end if;
    else 
		#主键重复
		set @selectsql=concat("select 'pkerror' as _error, 1 as flag"); 
    end if;
	#select @selectsql;
	prepare stmt from @selectsql;   
	execute stmt;
	deallocate prepare stmt;
end $$
delimiter ;

drop function if exists sys_GetJsonValue;
DELIMITER $$
create function sys_GetJsonValue(
	$json mediumtext,
	$key varchar(255),
    $type varchar(10)
) returns mediumtext deterministic
begin
	declare $value mediumtext;
	set $value=JSON_UNQUOTE(json_extract($json, concat('$.', $key)));
    if ($type<>'') then
		set $value=if($value is null, '', $value);
		if (trim($value)='') then
			if ($type='n') then set $value='0';
			elseif ($type='d') then set $value='1900-1-1'; 
			elseif ($type='t') then set $value='00:00';         
			end if;
		end if;
	end if;
    #set $value=replace($value, '"\"{\"', '"{\"');
	#set $value=replace($value, '\"}\""','\"}"');
    return $value;
end $$
delimiter ;

drop procedure if exists sys_GetColumnset;  #用show columns返回列的属性
DELIMITER $$
create procedure sys_GetColumnset(
	$database varchar(255),
	$tablename varchar(255),
    out $fieldset mediumtext    
)
begin
    set $database=if($database='', 'imlab2020', $database);
    #set $tablename=concat($database, '.',  $tablename);
    set @columns_str='';
    #set @sql=concat("SHOW COLUMNS FROM ", $tablename, " where @columns_str:=concat(@columns_str, if(@columns_str<>'', ',', ''), '{\"field\":\"', lower(`Field`),'\", \"type\":\"', `type`,'\", \"key\":\"', lower(`key`), '\", \"extra\":\"', lower(`extra`),'\" }')");
    set @sql=concat("SHOW COLUMNS FROM ", $tablename, " where @columns_str:=concat(@columns_str, if(@columns_str<>'', ',', ''), '{\"field\":\"', lower(`Field`),'\", \"type\":\"', `type`,'\", \"key\":\"', lower(`key`), '\", \"extra\":\"', lower(`extra`),'\" ");
    set @sql=concat(@sql, ",\"datatype\":\"', case 
    when left(lower(`type`),4)='int(' then 'n'
    when left(lower(`type`),7)='bigint(' then 'n'
    when left(lower(`type`),8)='smallint' then 'n'
    when left(lower(`type`),7)='tinyint' then 'n'
    when left(lower(`type`),3)='bit' then 'n'
    when left(lower(`type`),9)='mediumint' then 'n'
    when left(lower(`type`),7)='integer' then 'n'
    when left(lower(`type`),8)='decimal(' then 'n'
    when left(lower(`type`),5)='float' then 'n'
    when left(lower(`type`),6)='double' then 'n'
    when lower(`type`)='date' or lower(`type`)='datetime' then 'date'
    when lower(`type`)='time' then 'time'
    else lower(`type`)
    end, '\" }')");
    #select @sql;
    prepare stmt from @sql;
    execute stmt;
    deallocate prepare stmt;
	set $fieldset=concat('[', @columns_str, ']');    
end $$
delimiter ;
