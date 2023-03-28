import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import styles from '../styles/style';

const Loader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={60} color="#0000ff" />
    </View>
  );
};

export default Loader;
