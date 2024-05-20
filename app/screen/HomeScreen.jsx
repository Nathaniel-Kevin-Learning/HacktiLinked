import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import PostCards from '../components/PostCards';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { gql, useQuery } from '@apollo/client';
import ScreenHeader from '../components/ScreenHeader';
import { GET_CURRENT_USER, GET_POST } from '../query';
export default function HomeScreen({ navigation }) {
  const { loading, data, refetch, error } = useQuery(GET_POST);
  const {
    loading: loading2,
    data: UserData,
    error: error2,
  } = useQuery(GET_CURRENT_USER);

  if (error || error2) {
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScreenHeader />
        <Text>Something wrong happened</Text>
      </SafeAreaView>
    </SafeAreaProvider>;
  }

  useEffect(() => {
    refetch();
  }, []);

  if (loading || loading2) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ScreenHeader />
          <View style={[styles.containerLoading, styles.horizontalLoading]}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScreenHeader />
        {!loading && !loading2 && (
          <FlatList
            style={styles.mainContent}
            data={data.getPost}
            renderItem={({ item }) => (
              <PostCards item={item} UserData={UserData.getCurrentUser} />
            )}
            keyExtractor={(item) => item._id}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontalLoading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  mainContent: {
    flex: 1,
    padding: 16,
    marginBottom: 10,
  },
  post: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  postAuthor: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
  },
  postComposer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navigationTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
});
