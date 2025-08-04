import Button from "@/components/Button";
import CompletedModal from "@/components/CompletedModal";
import Exercise from "@/components/Exercise";
import Header from "@/components/Header";
import Numpad from "@/components/Numpad";
import { useStore } from "@/store";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddExerciseModal from "./AddExerciseModal";



type Props = {
  visible: boolean;
  onClose: () => void;
//   workoutName: string;
};

export default function WorkoutModal({ visible, onClose, }: Props) {
  const workoutDetails = useStore((state) => state.workoutDetails);
  const numpadVisible = useStore((state) => state.numpadVisible);
  const restCompletedVisible = useStore((state) => state.restCompletedVisible);
  const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);
  const setRestCompletedVisible = useStore((state) => state.setRestCompletedVisible);
  const insets = useSafeAreaInsets();
  useEffect(() => { 
    console.log(workoutDetails)
  }, [workoutDetails]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header with close button */}
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="chevron-down" size={28} color="white" />
          </Pressable>
          <Text style={styles.modalTitle}>{workoutDetails?.name}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            numpadVisible && { paddingBottom: 300 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Header 
            title={workoutDetails?.name || "Workout"}
          />
          <View style={styles.exerciseContainer}>
            {workoutDetails?.exercises.map((exercise, index) => (
              <Exercise key={index} exerciseDetails={exercise}/>
            ))}
            <View style={styles.addExerciseContainer}>
              <Button 
                title="Add Exercise"
                onPress={() => setAddExerciseModalVisible(true)}
                backgroundColor="#2D5472"
                color="#34A6FB"
              />
            </View>
          </View>
        </ScrollView>
        
        <Numpad 
          handlePressKey={(digit: string) => console.log(`Pressed ${digit}`)} 
          handlePressDelete={() => console.log('Delete pressed')}
        />
        <CompletedModal visible={restCompletedVisible} setVisible={setRestCompletedVisible}/>
        <AddExerciseModal addExerciseModalVisible={addExerciseModalVisible} setAddExerciseModalVisible={setAddExerciseModalVisible} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    backgroundColor: "#111113",
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 38, // Same width as close button
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    gap: 30,
  },
  exerciseContainer: { 
    flexDirection: "column",
    gap: 20,
  },
  addExerciseContainer: {
    marginTop: 20,
  },
});
