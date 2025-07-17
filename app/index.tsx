import Button from "@/components/Button";
import Exercise from "@/components/Exercise";
import Header from "@/components/Header";
import { useStore } from "@/store";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
export default function Index() {
  const [visible, setVisible] = useState(false);
  const startDate = new Date();
  const workoutDetails = useStore((state) => state.workoutDetails);

  return (
    <View style={styles.container}>
      <Header 
        title="Midday Workout" 
        startDate={startDate} 
      />
      <View style={styles.exerciseContainer}>
        {workoutDetails.map((exercise, index) => (
          <Exercise key={index} exerciseDetails={exercise}/>
        ))}
        <View style={{paddingHorizontal: 20}}>
          <Button 
            title="Add Exercise"
            onPress={() => setVisible(true)}
            backgroundColor="#2D5472"
            color="#34A6FB"
          />
        </View>
      </View>
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