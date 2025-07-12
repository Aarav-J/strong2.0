import Button from "@/components/Button";
import Exercise from "@/components/Exercise";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Numpad from "@/components/Numpad";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
export default function Index() {
  const [visible, setVisible] = useState(false);
  const startDate = new Date();
  return (
    <View
      style={styles.container}
    >
      <Header 
        title="Midday Workout" 
        startDate={startDate} 
        // startTime="0:00"
      />
      <View style={styles.exerciseContainer}>
      <Exercise 
        name="Bench Press (Barbell)"
        workoutDetails={[
          {
            sets: [
              { reps: 10, weight: 135, previous: "45 lb x 12" },
              { reps: 8, weight: 145, previous: "" },
            ],
          },
        ]}
      />

      <Button 
        title="Add Exercise"
        onPress={() => setVisible(true)}
        backgroundColor="#2D5472"
        color="#34A6FB"
      />

      </View>
      <Input 
        value={0} 
        onChange={(text) => console.log("Input changed:", text)}/>
      <Numpad visible={visible} onClose={(() => { 
        setVisible(false);
      })}/>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: 
  { 
    backgroundColor: "#111113",
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 30,
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
  }
})