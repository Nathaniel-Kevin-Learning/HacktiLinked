import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import FollowerSection from '../components/FollowerSection';
import FollowingSection from '../components/FollowingSection';
import { useMutation, useQuery } from '@apollo/client';
import ScreenHeader from '../components/ScreenHeader';
import { GET_CURRENT_USER, SEARCH_NAME_OR_USERNAME, USER_DATA } from '../query';
import { ADD_FOLLOWING } from '../mutation';

export default function ProfileScreen({ route }) {
  const {
    loading: loading2,
    data: UserData,
    refetch: refetch2,
  } = useQuery(GET_CURRENT_USER);

  const { loading, data, refetch } = useQuery(USER_DATA, {
    variables: {
      id: UserData.getCurrentUser._id,
    },
  });

  let searchUserById = null;
  let getFollower = [];
  let getFollowing = [];
  if (!loading2 && !loading) {
    searchUserById = data.searchUserById;
    getFollower = data.getFollower;
    getFollowing = data.getFollowing;
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [showFollowers, setShowFollowers] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const followersCount = getFollower.length;
  const followingCount = getFollowing.length;

  const [followUser] = useMutation(ADD_FOLLOWING);

  const handleFollow = async (id) => {
    try {
      await followUser({
        variables: {
          data: {
            followingId: id,
          },
        },
      });
      refetch();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const isAlreadyFollowing = (followerId) => {
    return getFollowing.some(
      (following) => following.followingId === followerId
    );
  };

  const { data: searchUserData, loading: loadingSearch } = useQuery(
    SEARCH_NAME_OR_USERNAME,
    {
      variables: { nameOrUsername: searchQuery },
    }
  );

  const handleSearch = () => {
    if (searchUserData && searchQuery != '') {
      setSearchResults(searchUserData.searchUserByNameOrUsername);
    } else {
      setSearchResults([]);
    }
    setSearchQuery('');
  };

  useEffect(() => {
    refetch2();
    refetch();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScreenHeader />
        {!loading && !loading2 && (
          <>
            <Image
              source={{ uri: 'https://picsum.photos/500/100' }}
              style={styles.userBackground}
            />
            <Image
              source={{ uri: searchUserById.image_url }}
              style={styles.profileImage}
            />
            <View style={styles.header}>
              <Text style={styles.username}>{searchUserById.username}</Text>
              <Text style={styles.email}>({searchUserById.email})</Text>
              <Text style={styles.name}>
                Hello there I am {searchUserById.name} nice to meet you
              </Text>
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search username or name..."
                onChangeText={(text) => setSearchQuery(text)}
                onSubmitEditing={handleSearch}
                value={searchQuery}
              />
              <TouchableOpacity
                onPress={handleSearch}
                style={styles.searchIconContainer}
              >
                <Ionicons
                  name="search"
                  size={40}
                  color="gray"
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  showFollowers ? styles.activeButton : null,
                ]}
                onPress={() => {
                  setShowFollowers(true);
                  setSearchResults(null);
                }}
              >
                <Text style={styles.buttonText}>
                  Followers ({followersCount})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  !showFollowers ? styles.activeButton : null,
                ]}
                onPress={() => {
                  setShowFollowers(false);
                  setSearchResults(null);
                }}
              >
                <Text style={styles.buttonText}>
                  Following ({followingCount})
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.userList}>
              {showFollowers ? (
                <View style={styles.followList}>
                  <FlatList
                    data={getFollower}
                    renderItem={({ item }) => (
                      <FollowerSection
                        item={item}
                        handleFollow={handleFollow}
                        isAlreadyFollowing={isAlreadyFollowing}
                      />
                    )}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={() => (
                      <Text style={styles.labelNoData}>
                        You don't have follower yet
                      </Text>
                    )}
                    ListHeaderComponent={() => (
                      <View>
                        {searchResults && (
                          <View>
                            <Text style={styles.label}>Search Results</Text>
                            {searchResults.length > 0 ? (
                              searchResults.map((user) => (
                                <View key={user._id} style={styles.userItem}>
                                  <View style={styles.userContainer}>
                                    <Image
                                      source={{ uri: user.image_url }}
                                      style={styles.userImage}
                                    />
                                    <View style={styles.nameContainer}>
                                      <Text style={styles.textUserName}>
                                        {user.username}
                                      </Text>
                                      <Text style={styles.textName}>
                                        ({user.name})
                                      </Text>
                                    </View>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => handleFollow(user._id)}
                                  >
                                    <Text
                                      style={[
                                        styles.followButton,
                                        isAlreadyFollowing(user._id)
                                          ? styles.followedButton
                                          : null,
                                      ]}
                                    >
                                      {isAlreadyFollowing(user._id)
                                        ? 'Followed'
                                        : 'Follow'}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ))
                            ) : (
                              <Text style={styles.labelNoData2}>
                                empty search result
                              </Text>
                            )}
                          </View>
                        )}
                        <Text style={styles.label}>Followers</Text>
                      </View>
                    )}
                  />
                </View>
              ) : (
                <View style={styles.followList}>
                  <FlatList
                    data={getFollowing}
                    renderItem={({ item }) => (
                      <FollowingSection
                        item={item}
                        handleFollow={handleFollow}
                      />
                    )}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={() => (
                      <Text style={styles.labelNoData}>
                        You follow no one yet
                      </Text>
                    )}
                    ListHeaderComponent={() => (
                      <View>
                        {searchResults && (
                          <View>
                            <Text style={styles.label}>Search Results</Text>
                            {searchResults.length > 0 ? (
                              searchResults.map((user) => (
                                <View key={user._id} style={styles.userItem}>
                                  <View style={styles.userContainer}>
                                    <Image
                                      source={{ uri: user.image_url }}
                                      style={styles.userImage}
                                    />
                                    <View style={styles.nameContainer}>
                                      <Text style={styles.textUserName}>
                                        {user.username}
                                      </Text>
                                      <Text style={styles.textName}>
                                        ({user.name})
                                      </Text>
                                    </View>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => handleFollow(user._id)}
                                  >
                                    <Text
                                      style={[
                                        styles.followButton,
                                        isAlreadyFollowing(user._id)
                                          ? styles.followedButton
                                          : null,
                                      ]}
                                    >
                                      {isAlreadyFollowing(user._id)
                                        ? 'Followed'
                                        : 'Follow'}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ))
                            ) : (
                              <Text style={styles.labelNoData2}>
                                empty search result
                              </Text>
                            )}
                          </View>
                        )}
                        <Text style={styles.label}>Following</Text>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          </>
        )}
        {loading && loading2 && (
          <View style={[styles.containerLoading, styles.horizontalLoading]}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userBackground: {
    width: '100%',
    height: 100,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontalLoading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  header: {
    marginTop: 35,
    paddingHorizontal: 20,
  },
  profileImage: {
    position: 'absolute',
    width: 90,
    height: 90,
    left: 20,
    top: 135,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    marginBottom: 5,
  },
  name: {
    fontSize: 14,
    marginBottom: 5,
    marginBottom: 15,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#e6e6e6',
  },
  activeButton: {
    backgroundColor: 'lightblue',
  },
  buttonText: {
    fontSize: 16,
  },
  userList: {
    flex: 1,
    width: '100%',
  },
  followList: {
    paddingHorizontal: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userContainer: {
    flexDirection: 'row',
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    textAlign: 'center',
    padding: 5,
  },
  textUserName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textName: {
    fontSize: 13,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  followButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: 'lightblue',
    color: 'black',
  },
  followedButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: 'blue',
    color: 'white',
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
  },
  labelNoData: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: '30%',
    color: 'red',
  },
  labelNoData2: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: '5%',
    textAlign: 'center',
    color: 'red',
  },
  searchContainer: {
    marginBottom: 5,
    paddingHorizontal: 18,
    marginLeft: 22,
    flexDirection: 'row',
  },

  searchIconContainer: {
    position: 'absolute',
    right: 30,
    bottom: 10,
  },
  searchIcon: {
    marginLeft: 10,
    backgroundColor: 'lightgray',
  },

  searchInput: {
    height: 40,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
