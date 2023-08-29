alter table "public"."trials" add column "name" text not null;

alter table "public"."trials" alter column "id" set default gen_random_uuid();

alter table "public"."trials" alter column "owner_id" set default auth.uid();

alter table "public"."trials" alter column "owner_id" drop not null;

create policy "authenticated_access"
on "public"."criteria"
as permissive
for all
to authenticated
using (true);


create policy "authenticated_access"
on "public"."measures"
as permissive
for all
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."trials"
as permissive
for insert
to authenticated
with check (true);


create policy "authenticated can read"
on "public"."trials"
as permissive
for select
to authenticated
using (true);


create policy "owner can delete"
on "public"."trials"
as permissive
for delete
to authenticated
using ((auth.uid() = owner_id));


create policy "owner can modify"
on "public"."trials"
as permissive
for update
to authenticated
using ((auth.uid() = owner_id));



