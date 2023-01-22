show variables like 'log_bin_trust_function_creators';
set global log_bin_trust_function_creators=1;
show variables like 'log_bin_trust_function_creators';

drop function if exists problem_rate;
delimiter $$
CREATE FUNCTION problem_rate($problemid char(10)) RETURNS varchar(100)
begin
	declare $rate float;
    declare $result varchar(100);
    declare $count int;
    declare $amount int;
    set $count = (select count(submitid) from submitItems where status = 1 and problemid = $problemid);
    set $amount = (select count(submitid) from submitItems where problemid = $problemid);
    set $rate=round($count/$amount*100,2);
    if $rate > 0 then
		set $result = concat($rate,'%');
	else
		set $result = concat('0','%');
	end if;
    return $result;
end $$
delimiter ;

drop function if exists plan_rate;
delimiter $$
CREATE FUNCTION plan_rate($planid char(10)) RETURNS varchar(100)
begin
	declare $rate float;
    declare $result varchar(100);
    declare $count int;
    declare $amount int;
    set $count = (select count(id) from plan_users where isend = 1 and planid = $planid);
    set $amount = (select count(id) from plan_users where planid = $planid);
    return concat($count,'人/',$amount,'人');
end $$
delimiter ;

drop function if exists plan_amount;
delimiter $$
CREATE FUNCTION plan_amount($planid char(10)) RETURNS int
begin
	select sum(point) into @sum from plan_problems where planid=$planid;
    return @sum;
end $$
delimiter ;

drop function if exists circle_type;
delimiter $$
CREATE FUNCTION circle_type($circle char(10)) RETURNS varchar(20)
begin
	select parentid into @sum from circles where circleid='1318936143';
    select circlename into @s from circles where circleid = @sum;
    return @s;
end $$
delimiter ;

drop function if exists get_last_submit_time;
delimiter $$
CREATE FUNCTION get_last_submit_time($problemid char(10),$userid char(10)) RETURNS varchar(20)
begin
	return 
    (select createtime from submititems where userid = $userid and problemid = $problemid order by createtime desc limit 1);
end $$
delimiter ;

drop function if exists get_submit_count;
delimiter $$
CREATE FUNCTION get_submit_count($problemid char(10),$userid char(10)) RETURNS varchar(20)
begin
	return 
    (select count(submitid) from submititems where userid = $userid and problemid = $problemid);
end $$
delimiter ;

drop function if exists get_problem_status;
delimiter $$
CREATE FUNCTION get_problem_status($problemid char(10),$userid char(10)) RETURNS varchar(20)
begin
	return 
    (select status from problemstatus where userid = $userid and problemid = $problemid);
end $$
delimiter ;

drop function if exists get_problem_status;
delimiter $$
CREATE FUNCTION get_problem_status($problemid char(10),$userid char(10)) RETURNS varchar(20)
begin
	return 
    (select status from problemstatus where userid = $userid and problemid = $problemid);
end $$
delimiter ;

drop function if exists get_user_problem_count;
delimiter $$
CREATE FUNCTION get_user_problem_count($userid char(10),$status int,$rankid int,$type varchar(20)) RETURNS varchar(20)
begin
	if $type = 'all' then
    set $type='';
    end if;
	if $status != 0 then 
		select count(a.id) into @n from problemstatus a 
		join problems b on a.problemid=b.problemid
		where a.userid = $userid and rankid=$rankid and status = $status and b.typeid like concat('%',$type,'%');
	else 
		select count(a.id) into @n from problemstatus a 
		join problems b on a.problemid=b.problemid
		where a.userid = $userid and rankid=$rankid and b.typeid like concat('%',$type,'%');
        select count(problemid) into @sum from problems
        where rankid=$rankid and typeid like concat('%',$type,'%');
        select (@sum - @n) into @n;
	end if;
    return @n;
end $$
delimiter ;

drop function if exists get_user_problem_submit_rate;
delimiter $$
CREATE FUNCTION get_user_problem_submit_rate($userid char(10),$rankid int,$type varchar(20)) RETURNS float
begin
	if $type = 'all' then
		set $type='';
    end if;
	select count(submitid) into @count from submititems a 
    join problems b on a.problemid = b.problemid
    where b.rankid = $rankid and b.typeid like concat('%',$type,'%') and status = 1 and userid=$userid;
    select count(submitid) into @sum from submititems a 
    join problems b on a.problemid = b.problemid  
    where b.rankid = $rankid and b.typeid like concat('%',$type,'%') and userid=$userid;
    return round(@count/@sum,2);
end $$
delimiter ;

drop function if exists get_all_problem_submit_rate;
delimiter $$
CREATE FUNCTION get_all_problem_submit_rate($rankid int,$type varchar(20)) RETURNS float
begin
	if $type = 'all' then
		set $type='';
    end if;
	select count(submitid) into @count from submititems a 
    join problems b on a.problemid = b.problemid
    where b.rankid = $rankid and b.typeid like concat('%',$type,'%') and status = 1;
    select count(submitid) into @sum from submititems a 
    join problems b on a.problemid = b.problemid  
    where b.rankid = $rankid and b.typeid like concat('%',$type,'%');
    return round(@count/@sum,2);
end $$
delimiter ;

select get_all_problem_submit_rate(1,'B');

