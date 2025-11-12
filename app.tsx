import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
    
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
