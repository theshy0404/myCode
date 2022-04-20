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
