import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarStyle: {
          backgroundColor: '#181818',
          borderTopColor: '#282828',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="library-music" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          title: 'Player',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="play-circle-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
