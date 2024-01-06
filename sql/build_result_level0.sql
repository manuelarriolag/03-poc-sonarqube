drop table if exists ResultLevel0;
create table ResultLevel0 (
    processDate timestamptz,
    squad VARCHAR(100),
    scoreA INTEGER,
    scoreB INTEGER,
    scoreC INTEGER,
    scoreD INTEGER,
    scoreE INTEGER
); 

create or replace procedure build_result_level0(v_now timestamptz)
language plpgsql
as $$
begin

	INSERT INTO ResultLevel0 (processDate, squad, scoreA, scoreB, scoreC, scoreD, scoreE)
		select 
				scoreA.processDate, scoreA.squad, 
				COALESCE(scoreA.score_count, 0), 
				COALESCE(scoreB.score_count, 0),
				COALESCE(scoreC.score_count, 0),
				COALESCE(scoreD.score_count, 0),
				COALESCE(scoreE.score_count, 0)
		from (
			SELECT 
				processDate, squad, count(*) as score_count
			FROM public.ResultDetails
				where score = 'A'
				and processDate = v_now
			group by 
				processDate, squad
		) as scoreA
		left join (
			SELECT 
				processDate, squad, count(*) as score_count
			FROM public.ResultDetails
				where score = 'B'
				and processDate = v_now
			group by 
				processDate, squad
		)  as scoreB on (scoreA.processDate = scoreB.processDate and scoreA.squad = scoreB.squad)
		left join (
			SELECT 
				processDate, squad, count(*) as score_count
			FROM public.ResultDetails
				where score = 'C'
				and processDate = v_now
			group by 
				processDate, squad
		)  as scoreC on (scoreA.processDate = scoreC.processDate and scoreA.squad = scoreC.squad)
		left join (
			SELECT 
				processDate, squad, count(*) as score_count
			FROM public.ResultDetails
				where score = 'D'
				and processDate = v_now
			group by 
				processDate, squad
		)  as scoreD on (scoreA.processDate = scoreD.processDate and scoreA.squad = scoreD.squad)
		left join (
			SELECT 
				processDate, squad, count(*) as score_count
			FROM public.ResultDetails
				where score = 'E'
				and processDate = v_now
			group by 
				processDate, squad
		)  as scoreE on (scoreA.processDate = scoreE.processDate and scoreA.squad = scoreE.squad)
		order by 1, 2;
	
	commit;

end; $$

/*

select * from ResultDetails limit 1;

call build_result_level0('2024-01-06 02:12:32.35146+00');

select * from ResultLevel0


*/

