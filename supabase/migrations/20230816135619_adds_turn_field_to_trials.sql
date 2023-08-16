alter table "public"."trials" add column "turn" integer;

create policy "Enable read access for all users"
on "public"."trial_items_answers"
as permissive
for select
to public
using (true);


create policy "service role can insert"
on "public"."trial_items_answers"
as permissive
for insert
to service_role
with check (true);



