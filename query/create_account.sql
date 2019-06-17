CREATE OR REPLACE function create_account(
	email text,--1
	firstName text,--2
	lastName text,--3
	roleUser integer,--4
	createDate text,--5
	idUser text,--6
	addressUser text,--7
	phone text,--8
	passwordUser text --9
)
RETURNS text AS $$	
declare countUser bigint;
declare message text;
BEGIN
	-- check any user have same email or phone
	select count(*) from user_table as utb
	where utb.email = $1 or utb.phone = $8
	into countUser;
	
	select 'create account' into message;
	
	if countUser >= 1
	then 
		select 'email or phone has already used' into message;
	else
		INSERT INTO user_table(
		first_name, last_name, id, address, phone, email, role, password, active, created_date, status, friends)
		VALUES ($2,$3,$6,$7,$8,$1,$4,$9,false,$5,1,null);
		select 'create success' into message;
	end if;
	
	return message;
END;
$$ LANGUAGE 'plpgsql' VOLATILE;

-- SELECT public.create_account(
-- 	'tqhuy1996.developer1@gmail.com', 
-- 	'Tran', 
-- 	'Kevin', 
-- 	1, 
-- 	'15091996', 
-- 	'82hdf9sh23kryd9sn238rt0sdj', 
-- 	'184 Nguyen Hue Street', 
-- 	'09465158472', 
-- 	'passwordtest'
-- )