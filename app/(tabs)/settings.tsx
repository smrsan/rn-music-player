import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ToggleSwitch from '../../components/ToggleSwitch';

const SettingsItem: React.FC<{ label: string; hasToggle?: boolean }> = ({ label, hasToggle }) => (
  <View style={styles.settingsItem}>
    <Text style={styles.itemLabel}>{label}</Text>
    {hasToggle && <ToggleSwitch initialValue={label.toLowerCase().includes('dark')} />}
  </View>
);

const LegalItem: React.FC<{ label: string; }> = ({ label }) => (
  <TouchableOpacity style={styles.legalItem}>
    <Text style={styles.itemLabel}>{label}</Text>
    <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
  </TouchableOpacity>
);


const SettingsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.mainContent}>
        <View>
          <SettingsItem label="Dark Mode" hasToggle />
          <SettingsItem label="Equalizer Presets" hasToggle />
          <SettingsItem label="Offline Mode" hasToggle />
          <SettingsItem label="Push Notifications" hasToggle />
          <SettingsItem label="Clear Cache" hasToggle />
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <LegalItem label="Privacy Policy" />
          <LegalItem label="Terms of Service" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  mainContent: {
    padding: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  itemLabel: {
    color: '#E5E7EB',
    fontSize: 18,
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  legalSection: {
    paddingTop: 24,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#282828',
  },
  sectionTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  footer: {
    paddingTop: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  versionText: {
    color: '#6B7280',
    fontSize: 12,
  },
});

export default SettingsScreen;
