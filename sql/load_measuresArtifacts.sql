
--truncate artifactMeasures;

COPY artifactMeasures FROM '/bitnami/postgresql/data/tmp/sonarqube.artifact-measures.csv' CSV;

-- select * from artifactMeasures
-- where metric = 'quality_gate_details';

select processdate, count(*) from artifactMeasures
    GROUP BY processdate;

-- 2024-01-10 23:32:14+00
-- 2024-01-10 23:32:14+00