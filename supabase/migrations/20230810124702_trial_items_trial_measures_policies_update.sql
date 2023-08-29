create policy "trial owner can delete"
on "public"."trial_item"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM trials
  WHERE ((trials.id = trial_item.trial_id) AND (trials.owner_id = auth.uid())))));


create policy "trial owner can update"
on "public"."trial_item"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM trials
  WHERE ((trials.id = trial_item.trial_id) AND (trials.owner_id = auth.uid())))));


create policy "Enable insert for authenticated users only"
on "public"."trial_measures"
as permissive
for insert
to authenticated
with check (true);


create policy "trial owner can delete"
on "public"."trial_measures"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM trials
  WHERE ((trials.id = trial_measures.trial_id) AND (trials.owner_id = auth.uid())))));


create policy "trial owner can read"
on "public"."trial_measures"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM trials
  WHERE ((trials.id = trial_measures.trial_id) AND (trials.owner_id = auth.uid())))));


create policy "trial owner can update"
on "public"."trial_measures"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM trials
  WHERE ((trials.id = trial_measures.trial_id) AND (trials.owner_id = auth.uid())))));


create policy "trial owner can delete"
on "public"."trial_partecipant"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM trials
  WHERE ((trials.id = trial_partecipant.trial_id) AND (trials.owner_id = auth.uid())))));


create policy "trial owner can update"
on "public"."trial_partecipant"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM trials
  WHERE ((trials.id = trial_partecipant.trial_id) AND (trials.owner_id = auth.uid())))));



