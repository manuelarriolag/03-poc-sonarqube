-- truncate components;

COPY components FROM '/bitnami/postgresql/data/tmp/sonarqube.components.csv'
 CSV HEADER;

select count(*) from components;

