'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { requestJson } from '../lib/api';
import { ErrorNotice } from './states';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    requestJson('/api/profile', { signal: controller.signal })
      .then(setProfile)
      .catch((failure) => {
        if (failure.name !== 'AbortError') setError(failure.message);
      });
    return () => controller.abort();
  }, [attempt]);

  if (error) {
    return <div className="profile-failure"><a className="text-link" href="/">回到首页</a><ErrorNotice message={error} onRetry={() => { setError(null); setAttempt(attempt + 1); }} /></div>;
  }

  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>;
}

export function useProfile() { return useContext(ProfileContext); }
