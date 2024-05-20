import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ADD_POST } from '../mutation';

export default function AddPostScreen({ navigation }) {
  const [postContent, setPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState([]);

  const tagData = [
    { name: 'Travel', value: 'Travel' },
    { name: 'Food', value: 'Food' },
    { name: 'Fashion', value: 'Fashion' },
    { name: 'Technology', value: 'Technology' },
    { name: 'Golden Week', value: 'Golden Week' },
    { name: 'Business', value: 'Business' },
    { name: 'Holiday', value: 'Holiday' },
    { name: 'Designer', value: 'Designer' },
    { name: 'Pet', value: 'Pet' },
    { name: 'Fitness', value: 'Fitness' },
    { name: 'Art', value: 'Art' },
    { name: 'Music', value: 'Music' },
    { name: 'Photography', value: 'Photography' },
    { name: 'Books', value: 'Books' },
    { name: 'Movies', value: 'Movies' },
    { name: 'Gaming', value: 'Gaming' },
    { name: 'DIY', value: 'DIY' },
    { name: 'Cooking', value: 'Cooking' },
    { name: 'Nature', value: 'Nature' },
    { name: 'Health', value: 'Health' },
  ];

  const [newPost, { loading }] = useMutation(ADD_POST, {
    refetchQueries: ['getAllPost'],
  });
  const handleAddPost = async () => {
    try {
      const postData = {
        content: postContent,
        imgUrl: imageUrl,
        tags,
      };

      await newPost({
        variables: {
          data: postData,
        },
      });
      setPostContent('');
      setImageUrl('');
      setTags([]);
      navigation.push('HomeTab');
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleTagPress = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    } else if (tags.includes(tag)) {
      setTags(
        tags.filter((el) => {
          return el !== tag;
        })
      );
    }
  };

  const renderSelectedTags = () => {
    return tags.map((tag, index) => (
      <View key={index} style={styles.tag}>
        <Text>{tag}</Text>
      </View>
    ));
  };

  const renderTags = () => {
    return tagData.map((tag, index) => (
      <TouchableOpacity
        key={index}
        style={styles.tagButton}
        onPress={() => handleTagPress(tag.value)}
      >
        <Text style={styles.tagText}>{tag.name}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaProvider>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              style={styles.addPostButton}
              onPress={handleAddPost}
              disabled={loading ? true : false}
            >
              <Text style={styles.addPostButtonText}>Add Post</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.Label}>Content</Text>
            <TextInput
              style={styles.inputArea}
              placeholder="Write your post content here..."
              multiline
              value={postContent}
              onChangeText={setPostContent}
            />
            <Text style={styles.Label}>Image Url</Text>
            <TextInput
              style={styles.inputNormal}
              placeholder="insert your image url here"
              value={imageUrl}
              onChangeText={setImageUrl}
            />
            {tags && tags.length != 0 && (
              <Text style={styles.Label}>Selected Tags</Text>
            )}

            <View style={styles.selectedTagsContainer}>
              {renderSelectedTags()}
            </View>
            <Text style={styles.Label}>Choose Tags</Text>
            <View style={styles.tagContainer}>{renderTags()}</View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    padding: 16,
    backgroundColor: '#fff',
  },
  addButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    height: 60,
  },
  inputContainer: {
    flex: 5.9,
  },
  addPostButton: {
    width: 100,
  },
  Label: {
    fontSize: 20,
    marginBottom: 10,
  },
  inputArea: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  inputNormal: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#333',
    fontWeight: 'bold',
  },

  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  addPostButton: {
    backgroundColor: '#34aeeb',
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addPostButtonText: {
    color: 'white',
    fontSize: 16,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
});
