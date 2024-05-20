import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CommentSection from '../components/CommentSection';
import { useMutation, useQuery } from '@apollo/client';
import { GET_POST_BY_ID } from '../query';
import ScreenHeader from '../components/ScreenHeader';
import { ADD_COMMENT, LIKE_POST } from '../mutation';

export default function PostDetailScreen({ route, navigation }) {
  const [comment, setComment] = useState('');
  const [errorImg, setErrorImg] = useState(false);
  const { _id, UserData } = route.params;

  const {
    loading,
    error,
    data: dataPost,
  } = useQuery(GET_POST_BY_ID, {
    variables: {
      id: _id,
    },
  });

  const [likePost, { loading: loadingLike }] = useMutation(LIKE_POST);

  const [addComment, { loading: loadingComment }] = useMutation(ADD_COMMENT);

  if (error) {
    Alert.alert(error.message);
  }

  let data = null;
  let comments = null;
  let userLikedPost = false;
  if (!loading) {
    data = dataPost.getPostById;
    comments = data.comments;
    userLikedPost = data.likes.some(
      (like) => like.username === UserData.username
    );
  } else {
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

  const commentHandler = () => {
    navigation.navigate('DetailPost', { _id: data._id, UserData });
  };

  const handleCommentSubmit = async () => {
    try {
      let data = await addComment({
        variables: {
          data: {
            postId: _id,
            content: comment,
          },
        },
      });
      setComment('');
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const likeHandler = async (_id) => {
    try {
      let data = await likePost({
        variables: {
          data: {
            postId: _id,
          },
        },
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const likeButtonColor = userLikedPost ? 'black' : 'gray';

  const onClickHandler = () => {
    Alert.alert('For future development');
  };

  const isValidUrl = (url) => {
    var urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!urlPattern.test(url);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {!loading && (
          <>
            <FlatList
              data={comments}
              renderItem={({ item }) => <CommentSection item={item} />}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={() => (
                <View style={styles.postContainer}>
                  <View style={styles.postHeader}>
                    <Image
                      source={{ uri: data.author.image_url }}
                      style={styles.authorImage}
                    />
                    <Text style={styles.authorName}>
                      {data.author.username}
                    </Text>
                  </View>
                  <Text style={styles.postContent}>{data.content}</Text>

                  <View style={styles.tagsContainer}>
                    {data.tags.map((tag, index) => (
                      <Text key={index} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>

                  {!errorImg && isValidUrl(data.imgUrl) && (
                    <Image
                      source={{ uri: data.imgUrl }}
                      style={styles.postImage}
                      onError={() => setErrorImg(true)}
                      resizeMode="contain"
                    />
                  )}
                  {(errorImg || !isValidUrl(data.imgUrl)) && (
                    <View style={styles.errorImageContainer}>
                      <Ionicons
                        name="image-outline"
                        size={50}
                        color="gray"
                      ></Ionicons>
                    </View>
                  )}

                  <View style={styles.bottomLeft}>
                    <MaterialIcons name="thumb-up" size={20} color="gray" />
                    <Text style={styles.likesCount}>
                      {data.likes.length} Likes
                    </Text>
                  </View>
                  <View style={styles.bottomRight}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={20}
                      color="gray"
                    />
                    <Text style={styles.commentCount}>
                      {data.comments.length} comments
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => likeHandler(data._id)}
                      disabled={loadingLike ? true : false}
                    >
                      <Ionicons
                        name={
                          userLikedPost
                            ? 'thumbs-up-sharp'
                            : 'thumbs-up-outline'
                        }
                        size={24}
                        color="gray"
                      />
                      <Text
                        style={[styles.buttonText, { color: likeButtonColor }]}
                      >
                        Like
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={commentHandler}
                    >
                      <Ionicons name="chatbox-outline" size={24} color="gray" />
                      <Text style={styles.buttonText}>Comment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={onClickHandler}
                    >
                      <Ionicons name="repeat-outline" size={24} color="gray" />
                      <Text style={styles.buttonText}>Repost</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={onClickHandler}
                    >
                      <Ionicons name="send-outline" size={24} color="gray" />
                      <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={comment}
                onChangeText={setComment}
                onSubmitEditing={handleCommentSubmit}
              />
              <TouchableOpacity
                style={styles.commentButton}
                onPress={handleCommentSubmit}
                disabled={loadingComment}
              >
                <Ionicons name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </>
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
    backgroundColor: '#fff',
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 40,
  },
  errorImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 8,
    borderRadius: 5,
    marginBottom: 40,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  commentInput: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
  },
  commentButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 20,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 55,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
  },
  likesCount: {
    marginLeft: 4,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 55,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
  },
  commentCount: {
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 4,
    color: 'gray',
  },
});
