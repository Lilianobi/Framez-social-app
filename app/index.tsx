import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import LoadingSpinner from '../src/components/LoadingSpinner';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (user && !inTabsGroup) {
      // User is signed in, redirect to tabs
      router.replace('/(tabs)/feed');
    } else if (!user && !inAuthGroup) {
      // User is not signed in, redirect to login
      router.replace('/(auth)/login');
    }
  }, [user, loading, segments]);

  return <LoadingSpinner text="Loading..." />;
}