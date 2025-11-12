import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to tabs
    if (user) {
      router.replace('/(tabs)/feed');
    }
  }, [user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}