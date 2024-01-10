drop table if exists ResultDetails;
create table ResultDetails (
    processDate timestamptz,
    squad VARCHAR(100),
    componentkey VARCHAR(100),
    score VARCHAR(10),
    score_name VARCHAR(110),
    domain VARCHAR(50),
	metricKey VARCHAR(100),
	metricValue DECIMAL(10,2)
); 

drop table if exists ComponentSizes;
create table ComponentSizes (
    processDate timestamptz,
    componentkey VARCHAR(100),
	nloc DECIMAL(10,2)
); 

create or replace procedure build_result_details(v_now timestamptz)
language plpgsql
as $$
begin

	-- RETORNA Score por squad/component/score/
	INSERT INTO ResultDetails
		SELECT 
			v_now, COALESCE(s.squad, '?'), m.componentkey, sc.score, sc.score || ' ' || sc.name, mm.domain, m.metric, CAST(m.value AS DECIMAL)
		FROM public.measures as m
		left join public.squads as s on (s.project = m.componentkey)
		left join public.metrics as mm on (m.metric = mm.key)
		left join public.scores as sc on (m.metric = sc.metricKey and CAST(m.value AS DECIMAL) BETWEEN sc.minValue and sc.MaxValue)
		where (m.processDate = v_now)
		and (m.metric IN (
			'reliability_rating', 'security_rating', 'security_review_rating', 'sqale_rating',
			'coverage', 'duplicated_lines_density', 'security_hotspots_reviewed', 
			'blocker_violations', 'critical_violations', 'major_violations'
			--'complexity', 'cognitive_complexity'
		))
		group by 
			s.squad, m.componentkey, sc.score, sc.name, mm.domain, m.metric, m.value
		order by 1, 2, 3, 4 DESC, 5, 6; 

		-- RETORNA el total de lineas por component
	INSERT INTO ComponentSizes
		SELECT 
			m.processDate, m.componentkey, CAST(m.value as decimal) as ncloc
		FROM public.measures as m
		where (m.processDate = v_now)
		and (m.metric = 'ncloc')
		order by 3 DESC;

	commit;

end; $$

/*

select distinct processDate 
	from measures 
	order by 1 DESC
	limit 3 

call build_result_details('2024-01-10 23:32:14+00');

select * from ResultDetails
	where score is null;

select * from ResultDetails
	where metricKey = 'security_hotspots_reviewed'
;

select * from ComponentSizes
;

*/
