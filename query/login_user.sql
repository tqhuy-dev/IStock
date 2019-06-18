create or replace function login_user(
	email text, --1
	passwordUser text,--2
	loginTime text,--3
	tokenUser text--4
)
returns text as $$
declare message text;
declare countUser bigint;
declare countUserAccount bigint;
begin
	select count(*) from user_table as utb
	where utb.email = $1 and utb.password = $2
	into countUser;

	if countUser != 0 
	then 
		select count(*) from account as act
		where act.email = $1
		into countUserAccount;

		if countUserAccount > 0
		then
			UPDATE account
			SET token=$4, login_date=$3
			WHERE account.email = $1;
		else
			insert into account(
				email , token , login_date , logout_date
			) values ($1 , $4 , $3 , '');
		end if; 
		select 'login success' into message;
	else 
		select 'username or password wrong' into message;
	end if;

	return message;
end
$$ LANGUAGE 'plpgsql' VOLATILE;