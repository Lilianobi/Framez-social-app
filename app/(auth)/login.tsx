import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !displayName)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        router.replace('/(tabs)/feed');
      } else {
        await signup(email, password, displayName);
        router.replace('/(tabs)/feed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.title}>Framez</Text>
          <Text style={styles.subtitle}>Share your moments</Text>

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#007AFF' },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 40, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, marginBottom: 15, borderRadius: 10, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  switchText: { marginTop: 20, textAlign: 'center', color: '#007AFF', fontSize: 16 },
});
