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
  const [localValue, setLocalValue] = useState(value);
  const [selection, setSelection] = useState({ start: value.length, end: value.length });
  
  const numpadVisible = useStore((state) => state.numpadVisible);
  const setNumpadVisible = useStore((state) => state.setNumpadVisible);
  const activeInputId = useStore((state) => state.activeInputId);
  const setActiveInputId = useStore((state) => state.setActiveInputId);

  const isActive = activeInputId === inputId;

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Update parent when local value changes
  useEffect(() => {
    if (isActive) {
      onChangeText(localValue);
    }
  }, [localValue, isActive]);

  const handleKeyPress = (key: string) => {
    if (!isActive) return;
    
    const newText = localValue.slice(0, selection.start) + key + localValue.slice(selection.end);
    const newCursor = selection.start + 1;
    
    setLocalValue(newText);
    setSelection({ start: newCursor, end: newCursor });
  };

  const handleDelete = () => {
    if (!isActive || selection.start === 0) return;
    
    const newText = localValue.slice(0, selection.start - 1) + localValue.slice(selection.end);
    const newCursor = selection.start - 1;
    
    setLocalValue(newText);
    setSelection({ start: newCursor, end: newCursor });
  };

  return (
    <TextInput
      ref={inputRef}
      value={localValue}
      selection={isActive ? selection : undefined}
      onSelectionChange={({ nativeEvent: { selection } }) => {
        if (isActive) {
          setSelection(selection);
          console.log(`Selection changed: ${JSON.stringify(selection)}`);
        }
      }}
      onFocus={() => {
        setActiveInputId(inputId);
        setNumpadVisible(true);
        console.log(inputId)
        // Move cursor to end on focus
        // const pos = localValue.length;
        setSelection({ start: 0, end: 0 });
      }}
      showSoftInputOnFocus={false}
      style={[
        styles.input,
        isActive && styles.activeInput
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
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    color: "white",
    height: 50,
    backgroundColor: '#222',
  },
  activeInput: {
    borderColor: '#34A6FB',
  }
});