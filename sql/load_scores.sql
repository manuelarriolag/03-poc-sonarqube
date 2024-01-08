drop table if exists Scores;
create table Scores (
    metricKey VARCHAR(100),
    score VARCHAR(10),
	minValue DECIMAL(10,2),
	maxValue DECIMAL(10,2),
    name VARCHAR(100)
); 

insert into Scores values
    ('reliability_rating', 'A', 1, 1, '0 Bugs'),
    ('reliability_rating', 'B', 2, 2, 'at least 1 Minor Bug'),
    ('reliability_rating', 'C', 3, 3, 'at least 1 Major Bug'),
    ('reliability_rating', 'D', 4, 4, 'at least 1 Critical Bug'),
    ('reliability_rating', 'E', 5, 5, 'at least 1 Blocker Bug')
;

insert into Scores values
    ('security_rating', 'A', 1, 1, '0 Vulnerabilities'),
    ('security_rating', 'B', 2, 2, 'at least 1 Minor Vulnerability'),
    ('security_rating', 'C', 3, 3, 'at least 1 Major Vulnerability'),
    ('security_rating', 'D', 4, 4, 'at least 1 Critical Vulnerability'),
    ('security_rating', 'E', 5, 5, 'at least 1 Blocker Vulnerability')
;

insert into Scores values
    ('security_hotspots_reviewed', 'A', 80.0, 999.99,  'Security Hotspots Reviewed are >= 80%'),
    ('security_hotspots_reviewed', 'B', 70.0,  79.99,  'Security Hotspots Reviewed are >= 70% and < 80%'),
    ('security_hotspots_reviewed', 'C', 50.0,  69.99,  'Security Hotspots Reviewed are >= 50% and < 70%'),
    ('security_hotspots_reviewed', 'D', 30.0,  49.99,  'Security Hotspots Reviewed are >= 30% and < 50%'),
    ('security_hotspots_reviewed', 'E',  0.0,  29.99,  'Security Hotspots Reviewed are < 30%')
;

insert into Scores values
    ('sqale_rating', 'A',  0.00,   5.99, 'Technical debt ratio is less than 5%'),
    ('sqale_rating', 'B',  6.00,  10.99, 'Technical debt ratio between 6 to 10%'),
    ('sqale_rating', 'C', 11.00,  20.99, 'Technical debt ratio between 11 to 20%'),
    ('sqale_rating', 'D', 21.00,  50.99, 'Technical debt ratio between 21 to 50%'),
    ('sqale_rating', 'E', 51.00, 999.99, 'Technical debt ratio over 51%')
;

insert into Scores values
    ('coverage', 'A+', 80.01, 100.00, 'less than 90%'),
    ('coverage', 'A',  60.00,  80.00, 'less than 80%'),
    ('coverage', 'B',  40.01,  60.00, 'less than 60%'),
    ('coverage', 'C',   0.00,  40.00, 'less than 40%')
;

insert into Scores values
    ('duplicated_lines_density', 'A+',  0.00,    3.00, 'greater than 3%'),
    ('duplicated_lines_density', 'A',   3.01,    6.00, 'greater than 6%'),
    ('duplicated_lines_density', 'B',   6.01,   10.00, 'greater than 10%'),
    ('duplicated_lines_density', 'C',  10.01,   20.00, 'greater than 20%'),
    ('duplicated_lines_density', 'D',  20.01,  100.00, 'over 20% (high duplicated lines density)')
;

insert into Scores values
    ('blocker_violations', 'A',  0, 0, 'worse than A (No Violations)'),
    ('blocker_violations', 'B',  1, 1, 'worse than B (at least 1 Blocker Violations)'),
    ('blocker_violations', 'C',  2, 2, 'worse than C (at least 2 Blocker Violations)'),
    ('blocker_violations', 'D',  3, 999999, 'over 2 Blocker Violations')
;

insert into Scores values
--    ('critical_violations', 'A+', 0, 0, 'worse than A (No Violations)'),
    ('critical_violations', 'A',  0, 0, 'worse than A (No Violations)'),
    ('critical_violations', 'B',  1, 1, 'worse than B (at least 1 Critical Violations)'),
    ('critical_violations', 'C',  2, 2, 'worse than C (at least 2 Critical Violations)'),
    ('critical_violations', 'D',  3, 999999, 'over 2 Critical Violations')
;

insert into Scores values
--    ('major_violations', 'A+', 0, 0, 'worse than A (No Violations)'),
    ('major_violations', 'A',  0, 0, 'worse than A (No Violations)'),
    ('major_violations', 'B',  1, 1, 'worse than B (at least 1 Major Violations)'),
    ('major_violations', 'C',  2, 2, 'worse than C (at least 2 Major Violations)'),
    ('major_violations', 'D',  3, 999999, 'over 2 Major Violations')
;

--Cyclomatic complexity
insert into Scores values
--    ('complexity', 'A+', 0,  10, 'greater than 10 (can be considered simple and testable)'),
    ('complexity', 'A',  0, 12, 'greater than 12 (can be considered simple and testable)'),
    ('complexity', 'B',  13, 15, 'greater than 15 (median complexity and hard to test)'),
    ('complexity', 'C',  16, 20, 'greater than 20 (high complexity and untestable)'),
    ('complexity', 'D',  21, 999999, 'over 20 (very high complexity and very untestable)')
;

--Cognitive complexity	
insert into Scores values
--    ('cognitive_complexity', 'A+', 0,  13, 'greater than 13 (very easy to understand)'),
    ('cognitive_complexity', 'A',  0, 15, 'greater than 15 (easy to understand)'),
    ('cognitive_complexity', 'B',  16, 17, 'greater than 17 (difficult to understand)'),
    ('cognitive_complexity', 'C',  18, 20, 'greater than 20 (very difficult to understand)'),
    ('cognitive_complexity', 'D',  21, 999999, 'over 20 (very-very difficult to understand)')
;



