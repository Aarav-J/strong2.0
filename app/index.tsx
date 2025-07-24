import Button from "@/components/Button";
import Exercise from "@/components/Exercise";
import Header from "@/components/Header";
import Numpad from "@/components/Numpad";
import { useStore } from "@/store";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Index() {
  const [visible, setVisible] = useState(false);
  const startDate = new Date();
  const workoutDetails = useStore((state) => state.workoutDetails);
  const numpadVisible = useStore((state) => state.numpadVisible);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          // Add bottom padding when numpad is visible to prevent content from being hidden
          numpadVisible && { paddingBottom: 300 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header 
          title="Midday Workout" 
          startDate={startDate} 
        />
        <View style={styles.exerciseContainer}>
          {workoutDetails.map((exercise, index) => (
            <Exercise key={index} exerciseDetails={exercise}/>
          ))}
          <View style={styles.addExerciseContainer}>
            <Button 
              title="Add Exercise"
              onPress={() => setVisible(true)}
              backgroundColor="#2D5472"
              color="#34A6FB"
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Numpad positioned absolutely at bottom */}
      <Numpad 
        handlePressKey={(digit: string) => console.log(`Pressed ${digit}`)} 
        handlePressDelete={() => console.log('Delete pressed')}
      />
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    backgroundColor: "#111113",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 60,
    gap: 30,
  },
  exerciseContainer: { 
    flexDirection: "column",
    gap: 20,
    // paddingHorizontal: 20,
  },
  addExerciseContainer: {
    marginTop: 20,
  },
  text: { 
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
    height: 50,
    backgroundColor: '#222',
  },
});