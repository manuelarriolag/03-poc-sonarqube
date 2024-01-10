--truncate squads;

COPY squads FROM '/bitnami/postgresql/data/tmp/sonarqube.squads.csv'
 CSV HEADER;

select count(*) from squads;

select * from squads;
