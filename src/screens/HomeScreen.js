import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MemeMaker</Text>
      <Text style={styles.subtitle}>Social Media Meme Generator</Text>
      <Text style={styles.description}>
        Create, customize, and share memes using OpenAI's GPT-image-1 API
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.secondary,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default HomeScreen;
