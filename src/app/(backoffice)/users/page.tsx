import React from 'react';

import { createClient } from '@supabase/supabase-js';
import UsersTable from './users-table';
import AddUser from './add-user';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { cookies } from 'next/headers';
import ErrorComponent from '@/app/components/error-component';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Users = async() => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user.user_metadata.isAdmin) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    return (
      <ErrorComponent>
        <span>
          {error.message}
        </span>
      </ErrorComponent>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center py-1">
        <AddUser />
      </div>
      <UsersTable rows={users} />
    </div>
  );
};

export default Users;
