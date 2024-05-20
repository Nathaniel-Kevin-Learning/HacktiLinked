import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useAuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ScreenHeader() {
  const { setAuthUser } = useAuthContext();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setAuthUser(false);
    } catch (error) {
      Alert.alert(error);
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>HacktiLinked</Text>
      <TouchableOpacity
        onPress={() => handleLogout()}
        style={styles.logoutButton}
      >
        <MaterialIcons name="logout" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#0077b5',
  },
  logoutButton: {
    marginTop: 10,
  },
});
