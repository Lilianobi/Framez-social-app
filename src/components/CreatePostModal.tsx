import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db, storage } from '../../firebaseConfig';
import { useAuth } from '../context/AuthContext';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ visible, onClose }: CreatePostModalProps) {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.6, // Lower quality for faster upload
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Image selected:', result.assets[0].uri);
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Starting upload for:', uri);
        
        // Fetch image as blob
        const response = await fetch(uri);
        const blob = await response.blob();
        
        console.log('Blob created, size:', blob.size);
        
        // Create unique filename
        const filename = `posts/${user?.uid}/${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);
        
        console.log('Uploading to:', filename);
        
        // Upload with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, blob);
        
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
            console.log('Upload progress:', progress.toFixed(0) + '%');
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Upload complete! URL:', downloadURL);
              resolve(downloadURL);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          }
        );
      } catch (error) {
        console.error('Upload setup error:', error);
        reject(error);
      }
    });
  };

  const handlePost = async () => {
    if (!caption.trim() && !image) {
      Alert.alert('Error', 'Please add a caption or image');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let imageUrl = '';
      
      if (image) {
        console.log('Image selected, starting upload...');
        imageUrl = await uploadImage(image);
        console.log('Image uploaded successfully');
      }

      console.log('Creating post document...');
      
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email || '',
        caption: caption.trim(),
        imageUrl: imageUrl || null,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });

      console.log('Post created successfully!');
      
      // Reset form
      setCaption('');
      setImage(null);
      setUploadProgress(0);
      onClose();
      
      Alert.alert('Success', 'Post created successfully!');
    } catch (error: any) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Upload Failed', 
        'Please check your internet connection and try again.\n\n' + 
        (error.message || 'Unknown error')
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setCaption('');
      setImage(null);
      setUploadProgress(0);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} disabled={uploading}>
              <Ionicons name="close" size={28} color={uploading ? "#ccc" : "#000"} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Post</Text>
            <TouchableOpacity 
              onPress={handlePost}
              disabled={uploading || (!caption.trim() && !image)}
              style={styles.postBtnContainer}
            >
              <Text style={[
                styles.postButton,
                (uploading || (!caption.trim() && !image)) && styles.postButtonDisabled
              ]}>
                {uploading ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
            </View>

            {/* Caption Input */}
            <TextInput
              style={styles.captionInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#999"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={500}
              editable={!uploading}
            />

            {/* Image Preview */}
            {image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                {!uploading && (
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setImage(null)}
                  >
                    <Ionicons name="close-circle" size={32} color="#FF3B30" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Add Photo Button */}
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={pickImage}
              disabled={uploading}
            >
              <Ionicons name="camera" size={24} color="#667eea" />
              <Text style={styles.addImageText}>
                {image ? 'Change Photo' : 'Add Photo'}
              </Text>
            </TouchableOpacity>

            {/* Upload Progress */}
            {uploading && (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                  </View>
                )}
                <Text style={styles.uploadingText}>
                  {uploadProgress > 0 && uploadProgress < 100
                    ? `Uploading... ${Math.round(uploadProgress)}%`
                    : 'Creating post...'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  postBtnContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  postButton: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonDisabled: {
    color: '#ccc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  captionInput: {
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: '#000',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 12,
    borderStyle: 'dashed',
    backgroundColor: '#F8F9FA',
  },
  addImageText: {
    marginLeft: 10,
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadingContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
  },
  uploadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
});