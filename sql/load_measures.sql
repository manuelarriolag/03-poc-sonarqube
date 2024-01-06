
truncate measures;

COPY measures FROM '/bitnami/postgresql/data/tmp/sonarqube.measures.csv' CSV;

-- select * from measures
-- where metric = 'quality_gate_details';

select processdate, count(*) from measures
    GROUP BY processdate;

