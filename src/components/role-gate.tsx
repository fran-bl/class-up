'use client';

import { createClient } from '@/utils/supabase/client';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import BadgeListener from './badge-listener';

type RoleGateProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

type DecodedJWT = {
  user_role: string;
};

export default function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        redirect('/login');
      }

      const jwt = jwtDecode<DecodedJWT>(session.access_token);
      const userRole = jwt.user_role;

      if (!allowedRoles.includes(userRole)) {
        redirect('/unauthorized');
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [allowedRoles]);

  if (isAuthorized === null) {
    return null;
  }

  return <>
    <BadgeListener />
    {children}
  </>;
}
