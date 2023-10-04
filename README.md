# OPEN NGT 
Open source Project got NGT

## NGT in a glimpse

NGT (Nominal Group Technique) is a research technique used in social science research to identify problems, generate solutions, and make decisions. NGT is a structured process that seeks to draw quantitative estimates through a qualitative approach. 

However, unlike other group interview techniques such as the focus group and the Delphi method individuals are asked to work independently to generate ideas rather than through interaction with each other. Hence the term nominal group as ‘individuals work in the presence (including online, ed.) of others but do not verbally interact’ (Zastrow & Navarre, 1977, p. 113).\
The individual ideas are then shared and discussed with the purpose of clarification and evaluation. Members are asked to prioritise the ideas individually and the aggregated rankings are collected.


## Tech stack
This project is developed using Next.js version 13, with supabase as the remote database and auth provider

## Basic project structure
The project follows the conventional naming for the Next.js app navigator.

Moreover, there is another convention used in the entire project:
- A component named `MyComponent` will be in a file called `my-component.tsx` ;
- Any subcomponent used *only* in a specific component will be in folder named as the component using 
it, at the same hierarchical level \
e.g. `MySubComponent` used only in `MyComponent` will be in the folder named `my-component`

## Useful scripts
- `apply_migrations`: Does a reset of the db, applying the migrations from the top. Useful for the first run;
- `generate:types`: Generate a types file with the database model, automagically parsing it with `better-supabase-types` for better ts support

## ENV variabiles
- `NEXT_PUBLIC_SUPABASE_URL`: The url of the supabase instances, taken from the supabase project settings page;
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The supabase key, taken from the supabase project settings page;
- `NEXT_PUBLIC_HOST_URL`: The url of the server instance;
- `SUPABASE_SERVICE_ROLE_KEY`: The supabase service role key, taken from the supabase project settings page;
- `ADMIN_PASSWORD`: the default super-admin password that will be set in the initialization

## First run and system details
After having correctly initialized the database, the migrations script create automatically two measures of 
dispersions that will be available for any trial, i.e. `STD` and `IQR`, as well as two criteria, i.e. 
`Feasibility` and `Significance`.\
Please note that the criteria can be managed via the gui, while the measures of dispersions needs to be added\
by a dev in the code.

For the first login, it is mandatory to run the api endpoint `<NEXT_PUBLIC_HOST_URL>/api/firstseed`: this will
create a new admin user with admin role, having a mail `admin@admin.com` and password `<ADMIN_PASSWORD>`.

Admin-role users can create other users - they are created direcly in the supabase auth schema, and don't
need an email confirmation.

Also, there is absolutely no email communication happening - the email is only used as a username.

Please note that only admin-roled user can create other users.