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
  const [selection, setSelection] = useState({ start: value.length, end: value.length });
  
  const numpadVisible = useStore((state) => state.numpadVisible);
  const setNumpadVisible = useStore((state) => state.setNumpadVisible);
  const activeInputId = useStore((state) => state.activeInputId);
  const setActiveInputId = useStore((state) => state.setActiveInputId);
  const currentSelection = useStore((state) => state.currentSelection);

  const isActive = activeInputId === inputId;

  // Only sync FROM store TO local when store selection changes and it's different
  useEffect(() => {
    if (isActive && currentSelection && 
        (currentSelection.start !== selection.start || currentSelection.end !== selection.end)) {
      setSelection(currentSelection);
    }
  }, [currentSelection, isActive]); // Remove selection from dependencies

  // Only update store when user manually changes selection (not from numpad)
  const updateStoreSelection = (newSelection: { start: number, end: number }) => {
    if (isActive) {
      useStore.setState({ currentSelection: newSelection });
    }
  };

  return (
    <TextInput
      ref={inputRef}
      value={value}
      selection={isActive ? selection : undefined}
      onSelectionChange={({ nativeEvent: { selection } }) => {
        if (isActive) {

          setSelection(selection);
          // Update store selection directly here instead of in useEffect
          updateStoreSelection(selection);
          console.log(selection)
        }
      }}
      onFocus={() => {
        setActiveInputId(inputId);
        setNumpadVisible(true);
        const pos = value.length;
        const newSelection = { start: pos, end: pos };
        setSelection(newSelection);
        updateStoreSelection(newSelection);
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