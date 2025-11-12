import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebaseConfig';
import CreatePostModal from '../../src/components/CreatePostModal';
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
  comments?: any[];
  createdAt: any;
}

export default function FeedScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setRefreshing(false);
    });

    return unsubscribe;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
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
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Framez</Text>
              <Text style={styles.headerSubtitle}>Express yourself freely ✨</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setModalVisible(true)} 
              style={styles.createBtnContainer}
            >
              <View style={styles.createBtn}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
              <Text style={styles.createLabel}>Create</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Feed */}
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#667eea"
              colors={['#667eea', '#764ba2']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.emptyIcon}
              >
                <Ionicons name="images-outline" size={48} color="#fff" />
              </LinearGradient>
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>Be the first to share your moment!</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                style={styles.emptyButtonContainer}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.emptyButton}
                >
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text style={styles.emptyButtonText}>Create Your First Post</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          }
        />

        {/* Create Post Modal */}
        <CreatePostModal 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
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
    height: 300,
    opacity: 0.1,
  },
  safeArea: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 16,
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    fontWeight: '500',
  },
  createBtnContainer: {
    alignItems: 'center',
    gap: 4,
  },
  createBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  createLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    paddingTop: 16,
    paddingBottom: 100, // Extra padding for tab bar
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyText: {
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
    fontWeight: '700',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  emptyButtonContainer: {
    borderRadius: 28,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});