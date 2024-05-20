import HomeScreen from '../screen/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddPostScreen from '../screen/AddPostScreen';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import ProfileScreen from '../screen/ProfileScreen';

const Tab = createBottomTabNavigator();
export default function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: (props) => {
            return (
              <Ionicons
                name="home-outline"
                size={props.size}
                color={props.color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Add Post"
        component={AddPostScreen}
        options={{
          headerShown: false,
          tabBarIcon: (props) => {
            return (
              <Ionicons
                name="add-circle-outline"
                size={props.size}
                color={props.color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="User Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: (props) => {
            return (
              <FontAwesome6 name="user" size={props.size} color={props.color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
