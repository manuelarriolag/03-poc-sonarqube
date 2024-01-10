
--truncate measures;

COPY measures FROM '/bitnami/postgresql/data/tmp/sonarqube.component-measures.csv' CSV;

-- select * from measures
-- where metric = 'quality_gate_details';

select processdate, count(*) from measures
    GROUP BY processdate;

-- 2024-01-10 23:32:14+00