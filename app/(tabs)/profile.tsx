import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebaseConfig';
import PostCard from '../../src/components/PostCard';
import { useAuth } from '../../src/context/AuthContext';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  caption: string;
  imageUrl?: string;
  likes: string[];
  createdAt: any;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setUserPosts(postsData);
    });

    return unsubscribe;
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }, 
          style: 'destructive' 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#F8F9FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Ionicons name="person" size={48} color="#fff" />
          </LinearGradient>
          
          <Text style={styles.displayName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
              style={styles.statCard}
            >
              <Text style={styles.statNumber}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Posts Section */}
        <View style={styles.postsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="grid-outline" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>My Posts</Text>
          </View>
          
          <FlatList
            data={userPosts}
            renderItem={({ item }) => <PostCard post={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.emptyIcon}
                >
                  <Ionicons name="camera-outline" size={36} color="#fff" />
                </LinearGradient>
                <Text style={styles.emptyText}>No posts yet</Text>
                <Text style={styles.emptySubtext}>Start sharing your moments!</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    opacity: 0.1,
  },
  safeArea: {
    flex: 1,
  },
  headerGradient: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  displayName: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
    color: '#000',
  },
  email: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
  },
  statsContainer: {
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  statCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  postsSection: {
    flex: 1,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  list: {
    paddingBottom: 100, // Extra padding for tab bar
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
    fontWeight: '700',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
});