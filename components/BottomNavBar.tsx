import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';

interface BottomNavBarProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  isActive: boolean;
  onClick: () => void;
}> = ({ iconName, isActive, onClick }) => {
  const color = isActive ? '#10B981' : '#6B7280';
  return (
    <TouchableOpacity onPress={onClick} style={styles.navItem}>
      <MaterialIcons name={iconName} size={28} color={color} />
    </TouchableOpacity>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentScreen, setScreen }) => {
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <NavItem
          iconName="library-music"
          isActive={currentScreen === Screen.LIBRARY}
          onClick={() => setScreen(Screen.LIBRARY)}
        />
        <NavItem
          iconName="play-circle-outline"
          isActive={currentScreen === Screen.PLAYER}
          onClick={() => setScreen(Screen.PLAYER)}
        />
        <NavItem
          iconName="settings"
          isActive={currentScreen === Screen.SETTINGS}
          onClick={() => setScreen(Screen.SETTINGS)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181818',
    borderTopWidth: 1,
    borderTopColor: '#282828',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 16,
  },
  navItem: {
    padding: 8,
  },
});

export default BottomNavBar;
