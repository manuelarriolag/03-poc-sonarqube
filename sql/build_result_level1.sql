drop table if exists ResultLevel1;
create table ResultLevel1 (
    processDate timestamptz,
    squad VARCHAR(100),
	componentkey VARCHAR(100), 
    scoreA INTEGER,
    scoreB INTEGER,
    scoreC INTEGER,
    scoreD INTEGER,
    scoreE INTEGER
); 

create or replace procedure build_result_level1(v_now timestamptz)
language plpgsql
as $$
begin

	INSERT INTO ResultLevel1 (processDate, squad, componentkey, scoreA, scoreB, scoreC, scoreD, scoreE)
		select 
				scoreA.processDate, scoreA.squad, scoreA.componentkey, 
				COALESCE(scoreA.score_count, 0), 
				COALESCE(scoreB.score_count, 0),
				COALESCE(scoreC.score_count, 0),
				COALESCE(scoreD.score_count, 0),
				COALESCE(scoreE.score_count, 0)
		from (
			SELECT 
				processDate, squad, componentkey, count(*) as score_count
			FROM public.ResultDetails
				where score = 'A'
				and processDate = v_now
			group by 
				processDate, squad, componentkey
		) as scoreA
		left join (
			SELECT 
				processDate, squad, componentkey, count(*) as score_count
			FROM public.ResultDetails
				where score = 'B'
				and processDate = v_now
			group by 
				processDate, squad, componentkey
		)  as scoreB on (scoreA.processDate = scoreB.processDate and scoreA.squad = scoreB.squad and scoreA.componentkey = scoreB.componentkey)
		left join (
			SELECT 
				processDate, squad, componentkey, count(*) as score_count
			FROM public.ResultDetails
				where score = 'C'
				and processDate = v_now
			group by 
				processDate, squad, componentkey
		)  as scoreC on (scoreA.processDate = scoreC.processDate and scoreA.squad = scoreC.squad and scoreA.componentkey = scoreC.componentkey)
		left join (
			SELECT 
				processDate, squad, componentkey, count(*) as score_count
			FROM public.ResultDetails
				where score = 'D'
				and processDate = v_now
			group by 
				processDate, squad, componentkey
		)  as scoreD on (scoreA.processDate = scoreD.processDate and scoreA.squad = scoreD.squad and scoreA.componentkey = scoreD.componentkey)
		left join (
			SELECT 
				processDate, squad, componentkey, count(*) as score_count
			FROM public.ResultDetails
				where score = 'E'
				and processDate = v_now
			group by 
				processDate, squad, componentkey
		)  as scoreE on (scoreA.processDate = scoreE.processDate and scoreA.squad = scoreE.squad and scoreA.componentkey = scoreE.componentkey)
		order by 1, 2, 3;
	
	commit;

end; $$

/*

select * from ResultDetails limit 1;

call build_result_level1('2024-01-06 02:12:32.35146+00');

select * from ResultLevel0;
select * from ResultLevel1;


*/

