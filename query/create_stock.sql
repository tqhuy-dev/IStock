CREATE OR REPLACE function create_stock(
	token text,--1
	name text,--2
	create_date text,--3
	id text,--4
	description text--5
)
RETURNS integer AS $$	
declare message integer;
declare emailUser text;
declare countStock bigint;
BEGIN
	select email from account
	where account.token = $1
	into emailUser;

	select count(*) from stock as stk
	where stk.email = emailUser and stk.name = $2
	into countStock;
	
	if countStock > 0
	then
		select 203 into message; --duplicate name stock
	else
		INSERT INTO stock(
		id, email, create_date, balance, stock_number, status, description, name)
		VALUES ($4,emailUser,$3,0,0,1,$5,$2);
		
		select 200 into message; --create stock success
		
	end if;
	
	return message;
END;
$$ LANGUAGE 'plpgsql' VOLATILE;

-- SELECT public.create_stock(
-- 	'52c05d77cff3bcdb43f244b536c206792e79ad06f18d5e956b43327f892280ac', 
-- 	'temp stock', 
-- 	'34623834739393', 
-- 	'37wbd83g29fdhe93hlsuf', 
-- 	'description'
--)
