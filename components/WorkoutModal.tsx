import Button from "@/components/Button";
import CompletedModal from "@/components/CompletedModal";
import Exercise from "@/components/Exercise";
import Numpad from "@/components/Numpad";
import { useStore } from "@/store";
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  const finishWorkout = useStore((state) => state.finishWorkout);
  const updateWorkoutName = useStore((state) => state.updateWorkoutName);
  const insets = useSafeAreaInsets();
  const [workoutDuration, setWorkoutDuration] = useState<string>("00:00");
  
  // State for workout name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [workoutName, setWorkoutName] = useState(workoutDetails?.name || "Workout");
  
  // Update workout name when workoutDetails changes
  useEffect(() => {
    if (workoutDetails?.name) {
      setWorkoutName(workoutDetails.name);
    }
  }, [workoutDetails?.name]);
  
  // Update timer every second
  useEffect(() => {
    if (!workoutDetails?.startTime) return;
    
    const updateDuration = () => {
      const now = Date.now();
      const startTime = workoutDetails.startTime || now; // Use now as fallback
      const duration = now - startTime;
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      setWorkoutDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    // Update immediately
    updateDuration();
    
    // Then update every second
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [workoutDetails]);
  
  const handleFinishWorkout = async () => {
    Alert.alert(
      "Finish Workout",
      "Are you sure you want to finish this workout? This will save your progress.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Finish", 
          style: "default",
          onPress: async () => {
            await finishWorkout();
            onClose();
          }
        }
      ]
    );
  };

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
          <View style={styles.titleContainer}>
            {isEditingName ? (
              <View style={styles.editTitleContainer}>
                <TextInput
                  style={styles.titleInput}
                  value={workoutName}
                  onChangeText={setWorkoutName}
                  autoFocus
                  selectionColor="#34A6FB"
                  placeholder="Workout Name"
                  placeholderTextColor="#888"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (workoutName.trim()) {
                      updateWorkoutName(workoutName);
                    } else {
                      setWorkoutName(workoutDetails?.name || "Workout");
                    }
                    setIsEditingName(false);
                  }}
                  onBlur={() => {
                    // Will handle in the button actions
                  }}
                  maxLength={30}
                />
                <View style={styles.titleButtonsContainer}>
                  <TouchableOpacity
                    style={styles.titleButton}
                    onPress={() => {
                      setWorkoutName(workoutDetails?.name || "Workout");
                      setIsEditingName(false);
                    }}
                  >
                    <Feather name="x" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.titleButton}
                    onPress={() => {
                      if (workoutName.trim()) {
                        updateWorkoutName(workoutName);
                      } else {
                        setWorkoutName(workoutDetails?.name || "Workout");
                      }
                      setIsEditingName(false);
                    }}
                  >
                    <Feather name="check" size={18} color="#34A6FB" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsEditingName(true)}
                style={styles.titleDisplay}
              >
                <Text style={styles.modalTitle}>{workoutDetails?.name}</Text>
                <Feather name="edit-2" size={16} color="#34A6FB" style={styles.editIcon} />
              </TouchableOpacity>
            )}
            <View style={styles.durationContainer}>
              <Ionicons name="time-outline" size={16} color="#34A6FB" />
              <Text style={styles.durationText}>{workoutDuration}</Text>
            </View>
          </View>
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
          {/* Header moved to top modal header */}
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
            {/* Finish workout button */}
            <View style={styles.finishButtonContainer}>
              <Button
                title="Finish Workout"
                onPress={handleFinishWorkout}
                backgroundColor="#2D5472"
                color="#34A6FB"
                icon={<MaterialIcons name="check-circle" size={22} color="#34A6FB" />}
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
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  durationText: {
    fontSize: 14,
    color: '#34A6FB',
    marginLeft: 5,
    fontWeight: '500',
  },
  titleDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  editIcon: {
    marginLeft: 8,
  },
  editTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34A6FB',
    textAlign: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#34A6FB',
    minWidth: 150,
  },
  titleButtonsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  titleButton: {
    padding: 5,
    marginLeft: 5,
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
    // paddingHorizontal: 20,
    gap: 30,
  },
  exerciseContainer: { 
    flexDirection: "column",
    gap: 20,
  },
  addExerciseContainer: {
    marginTop: 20,
  },
  finishButtonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
});
