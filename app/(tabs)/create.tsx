// app/(tabs)/create.tsx
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db, storage } from '../../firebaseConfig';
import { useAuth } from '../../src/context/AuthContext';

export default function CreatePostScreen() {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!caption && !imageUri) {
      Alert.alert('Error', 'Please add a caption or select an image.');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = '';
      if (imageUri) {
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}`);
        const response = await fetch(imageUri);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: user.displayName,
        caption,
        imageUrl,
        likes: [],
        createdAt: serverTimestamp(),
      });

      setCaption('');
      setImageUri(null);
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Write something..."
        value={caption}
        onChangeText={setCaption}
      />
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handlePost} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Posting...' : 'Post'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});
