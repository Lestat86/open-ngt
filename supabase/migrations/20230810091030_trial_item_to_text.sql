alter table "public"."trial_item" alter column "item_text" set not null;

alter table "public"."trial_item" alter column "item_text" set data type text using "item_text"::text;

create policy "Enable insert for authenticated users only"
on "public"."trial_item"
as permissive
for insert
to authenticated
with check (true);


create policy "owners can read their own"
on "public"."trial_item"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM trials
  WHERE ((trials.id = trial_item.trial_id) AND (trials.owner_id = auth.uid())))));


create policy "Enable insert for authenticated users only"
on "public"."trial_partecipant"
as permissive
for insert
to authenticated
with check (true);


create policy "trail owner can read"
on "public"."trial_partecipant"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM trials
  WHERE ((trials.id = trial_partecipant.trial_id) AND (trials.owner_id = auth.uid())))));



