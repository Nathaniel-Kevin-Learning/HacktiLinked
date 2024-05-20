import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function FollowingSection({ item, handleFollow }) {
  return (
    <View key={item._id} style={styles.userItem}>
      <View style={styles.userContainer}>
        <Image
          source={{ uri: item.following.image_url }}
          style={styles.userImage}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.textUserName}>{item.following.username}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          handleFollow(item.followingId);
        }}
      >
        <Text style={[styles.followButton, styles.followedButton]}>
          Followed
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    textAlign: 'center',
    padding: 10,
  },
  textUserName: {
    fontSize: 14,
    fontWeight: 'bold',
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
});
