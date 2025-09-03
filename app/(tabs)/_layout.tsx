import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
                // ... your existing screen options
                tabBarStyle: {
                    // ... your existing tab bar styles
                    zIndex: -100, // Lower zIndex for tab bar
                    backgroundColor: '#111113',
                    borderTopColor: '#333',
                    // elevation: 1 // Lower elevation for Android
                },
                tabBarActiveTintColor: '#34A6FB',
                tabBarInactiveTintColor: '#999',
            }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          tabBarBackground: () => <View style={{ flex: 1, backgroundColor: '#111113' }} />
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="dumbbell" size={20} color={color} />,
          tabBarBackground: () => <View style={{ flex: 1, backgroundColor: '#111113' }} />
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={22} color={color} />,
          tabBarBackground: () => <View style={{ flex: 1, backgroundColor: '#111113' }} />
        }}
      />
    </Tabs>
  );
}