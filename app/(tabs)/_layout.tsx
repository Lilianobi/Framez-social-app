import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';

export default function TabsLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
            height: Platform.OS === 'ios' ? 85 : 70,
            paddingBottom: Platform.OS === 'ios' ? 30 : 20,
            paddingTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 16,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: -2,
            marginBottom: 2,
          },
          tabBarIconStyle: {
            marginTop: 0,
          },
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={26}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={26}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="create" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
}
