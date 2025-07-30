import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
                // ... your existing screen options
                tabBarStyle: {
                    // ... your existing tab bar styles
                    zIndex: -100, // Lower zIndex for tab bar
                    // elevation: 1 // Lower elevation for Android
                }
            }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarBackground: () => <View style={{ flex: 1, backgroundColor: '#111113' }} />
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          headerShown: false,
          tabBarBackground: () => <View style={{ flex: 1, backgroundColor: '#111113' }} />
        }}
      />
      
    </Tabs>
  );
}