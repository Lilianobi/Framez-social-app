import { Ionicons } from '@expo/vector-icons';
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebaseConfig';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  caption: string;
  imageUrl?: string;
  likes: string[];
  comments?: Comment[];
  createdAt: any;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.uid || ''));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const postRef = doc(db, 'posts', post.id);
      
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        });
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        });
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;

    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        text: commentText.trim(),
        createdAt: Date.now(),
      };

      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      });

      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post from ${post.userName}: ${post.caption}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'posts', post.id));
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post');
            }
          }
        }
      ]
    );
  };

  const handleEdit = async () => {
    if (!editCaption.trim()) {
      Alert.alert('Error', 'Caption cannot be empty');
      return;
    }

    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        caption: editCaption.trim()
      });
      setIsEditing(false);
      Alert.alert('Success', 'Post updated!');
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'Failed to update post');
    }
  };

  const isOwner = user?.uid === post.userId;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(post.createdAt)}</Text>
          </View>
        </View>
        {isOwner && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.actionBtn}>
              <Ionicons name="create-outline" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Caption */}
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editCaption}
            onChangeText={setEditCaption}
            multiline
          />
          <View style={styles.editButtons}>
            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit} style={styles.saveBtn}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        post.caption && <Text style={styles.caption}>{post.caption}</Text>
      )}

      {/* Image */}
      {post.imageUrl && (
        <Image 
          source={{ uri: post.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Interaction Bar */}
      <View style={styles.interactionBar}>
        <TouchableOpacity onPress={handleLike} style={styles.interactionBtn}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? "#FF3B30" : "#000"} 
          />
          <Text style={styles.interactionText}>{likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowComments(!showComments)} style={styles.interactionBtn}>
          <Ionicons name="chatbubble-outline" size={22} color="#000" />
          <Text style={styles.interactionText}>{comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={styles.interactionBtn}>
          <Ionicons name="share-social-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {showComments && (
        <View style={styles.commentsSection}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentUser}>{comment.userName}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
          
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleComment} disabled={!commentText.trim()}>
              <Ionicons 
                name="send" 
                size={24} 
                color={commentText.trim() ? "#007AFF" : "#ccc"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 4,
  },
  caption: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  editContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  cancelText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  interactionBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 16,
  },
  interactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  interactionText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  comment: {
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
});