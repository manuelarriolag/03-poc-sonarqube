
select * from metrics;

-- select * from Scores;

-- RETORNA metrics y sus scores
select 
	    metrickey, score || ' ' || name
    from scores;

-- RETORNA las measures por squad/component
SELECT m.processdate, s.squad, m.componentkey, mm.domain, m.metric, m.value, m.bestvalue
	FROM public.squads as s
	inner join public.measures as m on (s.project = m.componentkey)
	inner join public.metrics as mm on (m.metric = mm.key)
	where m.metric <> 'quality_gate_details'
	and (mm.key = 'reliability_rating')
	order by m.processdate, s.squad, m.componentkey, mm.domain, m.metric;
	
	
-- RETORNA reliability_rating DESC
SELECT m.processdate, s.squad, m.componentkey, mm.domain, m.metric, m.value, m.bestvalue
	FROM public.measures as m
	inner join public.squads as s on (s.project = m.componentkey)
	inner join public.metrics as mm on (m.metric = mm.key)
	where (m.metric = 'reliability_rating');
	--order by m.value DESC	
	
-- RETORNA detalle de reliability_rating (issues relacionados)
SELECT 
		s.squad, mm.domain, m.componentkey, m.metric, m.value, m.bestvalue
	FROM public.measures as m
	inner join public.squads as s on (s.project = m.componentkey)
	inner join public.metrics as mm on (m.metric = mm.key and (mm.domain in ('Issues')))
	where
	(m.componentkey in (
		SELECT DISTINCT m.componentkey
			FROM public.measures as m
			where (m.metric = 'reliability_rating')
			and (m.bestvalue <> true)	
			--order by 1		
	))
	and (m.value <> 'OK' and m.value <> '0')
	order by cast(m.value as DOUBLE PRECISION) DESC
	--limit 20
;

-- RETORNA el score de las metrics
SELECT 
		m.metric, m.value, sc.score, sc.minValue, sc.MaxValue
	FROM public.measures as m
	left join public.scores as sc on (m.metric = sc.metricKey and CAST(m.value AS DECIMAL) BETWEEN sc.minValue and sc.MaxValue)
	where (m.metric IN ('reliability_rating'));

-- RETORNA el total de lineas por component
SELECT 
		m.processDate, m.componentkey, CAST(m.value as decimal) as ncloc
	FROM public.measures as m
	--inner join public.squads as s on (s.project = m.componentkey)
	left join public.scores as sc on (m.metric = sc.metricKey and CAST(m.value AS DECIMAL) BETWEEN sc.minValue and sc.MaxValue)
	where (m.metric IN ('ncloc'))
	order by 3 DESC
;


SELECT 
		m.componentkey, m.metric, m.value
	FROM public.measures as m
	where (m.metric IN ('security_hotspots_reviewed'));



---------------- IDENTIFICAR NIVELES

-- Score por squad/component/score/
SELECT 
		COALESCE(s.squad, '?'), m.componentkey, sc.score, sc.name, mm.domain, m.metric, CAST(m.value AS DECIMAL)
	FROM public.measures as m
	left join public.squads as s on (s.project = m.componentkey)
	left join public.metrics as mm on (m.metric = mm.key)
	left join public.scores as sc on (m.metric = sc.metricKey and CAST(m.value AS DECIMAL) BETWEEN sc.minValue and sc.MaxValue)
	where (m.metric IN (
		'reliability_rating', 'security_rating', 'security_review_rating', 'sqale_rating',
		'coverage', 'duplicated_lines_density', 'security_hotspots_reviewed', 
		'blocker_violations', 'critical_violations', 'major_violations',
		'complexity', 'cognitive_complexity'
	))
	group by 
		s.squad, m.componentkey, sc.score, sc.name, mm.domain, m.metric, m.value
	--having sc.score in ('C', 'D', 'E') 
	having sc.score is null
	--having s.squad is null
	order by 1, 2, 3 DESC, 4, 5, 6
	--order BY 6
;



