alter table "public"."trial_partecipant" drop constraint "trial_partecipant_trial_id_fkey";

alter table "public"."trial_partecipant" add constraint "trial_partecipant_trial_id_fkey" FOREIGN KEY (trial_id) REFERENCES trials(id) ON DELETE CASCADE not valid;

alter table "public"."trial_partecipant" validate constraint "trial_partecipant_trial_id_fkey";


