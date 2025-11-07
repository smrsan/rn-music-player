import React, { useState } from 'react';
import { Switch } from 'react-native';

interface ToggleSwitchProps {
  initialValue?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ initialValue = false }) => {
  const [isOn, setIsOn] = useState(initialValue);

  return (
    <Switch
      trackColor={{ false: "#767577", true: "#10B981" }}
      thumbColor={isOn ? "#f4f3f4" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={setIsOn}
      value={isOn}
    />
  );
};

export default ToggleSwitch;
