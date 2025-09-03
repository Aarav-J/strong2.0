import { useStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';


type Props = {
  value: string;
  onChangeText: (text: string) => void;
  inputId: string;
};

export default function NumpadInput({ value, onChangeText, inputId }: Props) {
  const inputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState({ start: 0, end: value.length });
  const [hasFocused, setHasFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  
  const numpadVisible = useStore((state) => state.numpadVisible);
  const setNumpadVisible = useStore((state) => state.setNumpadVisible);
  const activeInputId = useStore((state) => state.activeInputId);
  const setActiveInputId = useStore((state) => state.setActiveInputId);
  const currentSelection = useStore((state) => state.currentSelection);
  const exerciseKey = inputId?.split('-')[1]; // Default to '0' if exerciseKey is undefined
  const setKey = inputId?.split('-')[2]; // Default to '0' if setKey is undefined
  const workoutDetails = useStore((state) => state.workoutDetails);
  const isActive = activeInputId === inputId;

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Only sync FROM store TO local when store selection changes and it's different
  useEffect(() => {
    if (isActive && currentSelection && 
        (currentSelection.start !== selection.start || currentSelection.end !== selection.end)) {
      setSelection(currentSelection);
    }
  }, [currentSelection, isActive]);

  // If value changes externally, update selection to end
  useEffect(() => {
    if (isActive && hasFocused) {
      setSelection({ start: localValue.length, end: localValue.length });
    }
  }, [localValue, isActive, hasFocused]);

  useEffect(() => {
    if (activeInputId !== inputId) {
      // Only change to "0" if completely empty on blur
      if (localValue === '') {
        onChangeText('0');
      }
      inputRef.current?.blur();
      setHasFocused(false);
    }
  }, [activeInputId, inputId, localValue, onChangeText]);

  // Only update store when user manually changes selection (not from numpad)
  const updateStoreSelection = (newSelection: { start: number, end: number }) => {
    if (isActive) {
      useStore.setState({ currentSelection: newSelection });
    }
  };

  return (
    <TextInput
      ref={inputRef}
      value={localValue}
      selection={isActive ? selection : undefined}
      onSelectionChange={({ nativeEvent: { selection } }) => {
        if (isActive) {
          setSelection(selection);
          updateStoreSelection(selection);
        }
      }}
      onChangeText={(text) => {
        setLocalValue(text);
        onChangeText(text);
      }}
      onFocus={() => {
        setActiveInputId(inputId);
        setNumpadVisible(true);
        // Only select all on first focus or if value is "0"
        if (!hasFocused || localValue === "0") {
          setSelection({ start: 0, end: localValue.length });
          updateStoreSelection({ start: 0, end: localValue.length });
        }
        setHasFocused(true);
      }}
      onBlur={() => {
        // Only convert empty value to "0" on blur
        if (localValue === '' || localValue === null) {
          setLocalValue('0');
          onChangeText('0');
        }
        setHasFocused(false);
      }}
      showSoftInputOnFocus={false}
      style={[
        styles.input,
        isActive && styles.activeInput,
        workoutDetails?.exercises?.[parseInt(exerciseKey)]?.sets[parseInt(setKey)]?.completed && styles.completedInput
      ]}
      caretHidden={false}
      selectionColor="#34A6FB"
      selectTextOnFocus={false}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#888',
    // paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 18,
    color: "white",
    width: 50,
    textAlign: 'center',
    // paddingHorizontal: 3,
    // height: 50,
    backgroundColor: '#222',
  },
  activeInput: {
    borderColor: '#34A6FB',
  }, 
  completedInput: { 
    backgroundColor: 'transparent',
    color: "white",
    fontSize: 16,
    // textAlign: "center",
    fontWeight: "bold", 
    borderColor: 'transparent',
  }
   
});