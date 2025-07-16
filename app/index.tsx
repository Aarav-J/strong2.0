import Button from "@/components/Button";
import Exercise from "@/components/Exercise";
import Header from "@/components/Header";
import Numpad from "@/components/Numpad";
import { useStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
export default function Index() {
  const [value, setValue] = useState("")
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [visible, setVisible] = useState(false);
  const startDate = new Date();
  const setNumpadVisible = useStore((state) => state.setNumpadVisible)
  const numpadVisible = useStore((state) => state.numpadVisible)
  const workoutDetails = useStore((state) => state.workoutDetails)
  const inputRef = useRef<TextInput>(null);
  const handleFocus = () => { 
    setNumpadVisible(true);
    inputRef.current?.focus(); // Focus the TextInput when the numpad is shown
  }
  useEffect(() => {
  if (numpadVisible) {
    inputRef.current?.focus();
  }
}, [numpadVisible]);
  function handlePressKey(digit: string) {
    const { start, end } = selection;
    const newText =
      value.slice(0, start) +
      digit +
      value.slice(end);
    const newPos = start + digit.length;
    
    // Update value and selection together
    setValue(newText);
    requestAnimationFrame(() => {
      setSelection({ start: newPos, end: newPos });
      // Ensure focus is maintained
      inputRef.current?.focus();
    });
  } 

  function handlePressDelete() {
    const { start, end } = selection;
    if (start === 0 && end === 0) return;

    if (start !== end) {
      // delete highlighted range
      const newText = value.slice(0, start) + value.slice(end);
      setValue(newText);
      setSelection({ start, end: start });
    } else {
      // delete one char before cursor
      const newStart = start - 1;
      const newText = value.slice(0, newStart) + value.slice(end);
      setValue(newText);
      setSelection({ start: newStart, end: newStart });
    }
  }

  return (
    <View
      style={styles.container}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onFocus={() => {
          setNumpadVisible(true);
          // Ensure the input stays focused
          inputRef.current?.focus();
        }}
        // Add onBlur to handle keyboard dismissal
        onBlur={() => {
          if (inputRef.current) {
            // Prevent losing focus when numpad is visible
            inputRef.current.focus();
          }
        }}
        caretHidden={false}
        showSoftInputOnFocus={false}
        editable={true}
        selection={selection}
        onSelectionChange={({ nativeEvent: { selection } }) => {
          setSelection(selection);
        }}
        cursorColor='red'
        keyboardType="numeric"          
        selectionColor="red"  
        style={styles.input}
/>
 {/* <TextInput
      // value={value}
        style={styles.input}
        editable={true}  
        selection={selection}
        onSelectionChange={({ nativeEvent: { selection } }) =>
          setSelection(selection)
        }
        keyboardType="numeric"
        cursorColor='red'
        selectionColor="red"
        // showSoftInputOnFocus={false}
/> */}
      <Header 
        title="Midday Workout" 
        startDate={startDate} 
        // startTime="0:00"
      />
      <View style={styles.exerciseContainer}>
      
      {
        workoutDetails.map((exercise, index) => { 
          return <Exercise key={index} exerciseDetails={exercise}/>
        })
      }
        <View style={{paddingHorizontal: 20}}>

          <Button 
            title="Add Exercise"
            onPress={() => setVisible(true)}
            backgroundColor="#2D5472"
            color="#34A6FB"
          />
        </View>
      </View>
      
      <Numpad handlePressDelete={handlePressDelete} handlePressKey={handlePressKey}/>
      {/* <Text style={{color / : "white"}}>{JSON.stringify(workoutDetails)}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: 
  { 
    backgroundColor: "#111113",
    flex: 1,
    flexDirection: "column",
    // paddingHorizontal: 30,
    gap: 60, 
    paddingVertical: 60,
    // justifyContent: "center",
    // alignItems: "center"
  },
  exerciseContainer: { 
    flexDirection: "column",
    gap: 20,
    // backgroundColor: "red",
  },
  text: 
  { 
    fontSize: 20, 
    color: "white"
  }, 
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    color: "white",
    height: 50, // Add fixed height
    backgroundColor: '#222', // Add background color
  },
})