import Numpad from "@/components/Numpad";
import { useStore } from "@/store";
import { useNumpadInput } from "@/utils/hooks";
import { StyleSheet, TextInput, View } from "react-native";

type Props = { 
    value: string; 
    onChangeText: (text: string) => void; 
    style?: any; 
}; 

export default function NumpadInput({value: externalValue, onChangeText, style}: Props) {
    const { 
        value, 
        selection, 
        inputRef, 
        setValue, 
        setSelection, 
        handleKeyPress,
        handleDelete
    } = useNumpadInput(externalValue);

    const numpadVisible = useStore((state) => state.numpadVisible);
    const setNumpadVisible = useStore((state) => state.setNumpadVisible);

    return (
    <View>
      <TextInput
        ref={inputRef}
        value={value}
        selection={selection}
        onSelectionChange={({ nativeEvent: { selection } }) => {
          setSelection(selection);
        }}
        onFocus={() => {
          setNumpadVisible(true);
          inputRef.current?.focus();
        }}
        onBlur={() => {
          if (numpadVisible) {
            inputRef.current?.focus();
          }
        }}
        onChangeText={(text) => {
          setValue(text);
          onChangeText(text);
        }}
        showSoftInputOnFocus={false}
        style={[styles.input, style]}
        caretHidden={false}
        selectionColor="#34A6FB"
      />
      <Numpad 
        handlePressKey={handleKeyPress}
        handlePressDelete={handleDelete}
      />
    </View>
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
});