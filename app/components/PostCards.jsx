import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { LIKE_HOME } from '../mutation';
export default function PostCards({ item, UserData }) {
  const [errorImg, setErrorImg] = useState(false);
  const navigation = useNavigation();

  const [likePost, { loading: loadingLike }] = useMutation(LIKE_HOME);
  // check user like the post or not
  const userLikedPost = item.likes.some(
    (like) => like.username === UserData.username
  );
  // changing color of the like
  const likeButtonColor = userLikedPost ? 'black' : 'gray';

  const handleDetailPage = () => {
    navigation.navigate('DetailPost', { _id: item._id, UserData });
  };

  const commentHandler = () => {
    navigation.navigate('DetailPost', { _id: item._id, UserData });
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

  // checking if valid url or not
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

  const onClickHandler = () => {
    Alert.alert('For future development');
  };

  return (
    <TouchableOpacity style={styles.postContainer} onPress={handleDetailPage}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: item.author.image_url }}
          style={styles.authorImage}
        />
        <Text style={styles.authorName}>{item.author.username}</Text>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
      {!errorImg && isValidUrl(item.imgUrl) && (
        <Image
          source={{ uri: item.imgUrl }}
          style={styles.postImage}
          onError={() => setErrorImg(true)}
          resizeMode="contain"
        />
      )}
      {(errorImg || !isValidUrl(item.imgUrl)) && (
        <View style={styles.errorImageContainer}>
          <Ionicons name="image-outline" size={50} color="gray"></Ionicons>
        </View>
      )}
      <View style={styles.bottomLeft}>
        <MaterialIcons name="thumb-up" size={20} color="gray" />
        <Text style={styles.likesCount}>{item.likes.length} Likes</Text>
      </View>
      <View style={styles.bottomRight}>
        <Ionicons name="chatbubble-outline" size={20} color="gray" />
        <Text style={styles.commentCount}>{item.comments.length} comments</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => likeHandler(item._id)}
          disabled={loadingLike ? true : false}
        >
          <Ionicons
            name={userLikedPost ? 'thumbs-up-sharp' : 'thumbs-up-outline'}
            size={24}
            color="gray"
          />
          <Text style={[styles.buttonText, { color: likeButtonColor }]}>
            Like
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={commentHandler}>
          <Ionicons name="chatbox-outline" size={24} color="gray" />
          <Text style={styles.buttonText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onClickHandler}>
          <Ionicons name="repeat-outline" size={24} color="gray" />
          <Text style={styles.buttonText}>Repost</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onClickHandler}>
          <Ionicons name="send-outline" size={24} color="gray" />
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontWeight: 'bold',
  },
  postContent: {
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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

  bottomLeft: {
    position: 'absolute',
    bottom: 50,
    left: 0,
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
    bottom: 50,
    right: 0,
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
