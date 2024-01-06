drop table if exists ResultDetails;
create table ResultDetails (
    processDate timestamptz,
    squad VARCHAR(100),
    componentkey VARCHAR(100),
    score VARCHAR(10),
    score_name VARCHAR(110),
    domain VARCHAR(50),
	metricKey VARCHAR(100)
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
			v_now, s.squad, m.componentkey, sc.score, sc.score || ' ' || sc.name, mm.domain, m.metric
		FROM public.measures as m
		inner join public.squads as s on (s.project = m.componentkey)
		inner join public.metrics as mm on (m.metric = mm.key)
		inner join public.scores as sc on (m.metric = sc.metricKey and CAST(m.value AS DECIMAL) BETWEEN sc.minValue and sc.MaxValue)
		where (m.processDate = v_now)
		and (m.metric IN (
			'reliability_rating', 'security_rating', 'security_review_rating', 'sqale_rating',
			'coverage', 'duplicated_lines_density', 
			'blocker_violations', 'critical_violations', 'major_violations',
			'complexity', 'cognitive_complexity'
		))
		group by 
			s.squad, m.componentkey, sc.score, sc.name, mm.domain, m.metric
		--having sc.score in ('C', 'D', 'E') 
		order by 1, 2, 3, 4 DESC, 5, 6; 

		-- RETORNA el total de lineas por component
	INSERT INTO ComponentSizes
		SELECT 
			m.processDate, m.componentkey, CAST(m.value as decimal) as ncloc
		FROM public.measures as m
		--inner join public.squads as s on (s.project = m.componentkey)
		left join public.scores as sc on (m.metric = sc.metricKey and CAST(m.value AS DECIMAL) BETWEEN sc.minValue and sc.MaxValue)
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

call build_result_details('2024-01-03 23:59:08+00');

select * from ResultDetails

select * from ComponentSizes

*/
