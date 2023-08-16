create policy "anon read access"
on "public"."criteria"
as permissive
for select
to anon
using (true);


create policy "anon read access"
on "public"."measures"
as permissive
for select
to anon
using (true);


create policy "anon read access"
on "public"."trial_item"
as permissive
for select
to anon
using (true);


create policy "anon read access"
on "public"."trial_item_with_criteria"
as permissive
for select
to anon
using (true);


create policy "anon read access"
on "public"."trial_measures"
as permissive
for select
to anon
using (true);


create policy "anon read access"
on "public"."trial_partecipant"
as permissive
for select
to anon
using (true);


create policy "anon read access"
on "public"."trials"
as permissive
for select
to anon
using (true);



