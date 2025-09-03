import { useStore } from "@/store";
import { CompletedWorkout } from "@/types";
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const workoutHistory = useStore((state) => state.workoutHistory);
  const exerciseData = useStore((state) => state.exerciseData);
  const loadWorkoutHistory = useStore((state) => state.loadWorkoutHistory);
  const deleteWorkout = useStore((state) => state.deleteWorkout);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null);
  
  useEffect(() => {
    const loadHistory = async () => {
      await loadWorkoutHistory();
      setLoading(false);
    };
    
    loadHistory();
  }, []);
  
  // Format duration from milliseconds to human-readable format
  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes} min`;
    }
  };
  
  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate total weight lifted in a workout
  const calculateTotalWeight = (workout: CompletedWorkout): number => {
    let totalWeight = 0;
    
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed) {
          totalWeight += set.weight * set.rep;
        }
      });
    });
    
    return totalWeight;
  };
  
  // Calculate total sets completed in a workout
  const calculateCompletedSets = (workout: CompletedWorkout): number => {
    let completedSets = 0;
    
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed) {
          completedSets++;
        }
      });
    });
    
    return completedSets;
  };

  // Calculate total volume per muscle group
  const calculateMuscleGroupVolume = (workout: CompletedWorkout) => {
    const muscleGroupVolume: Record<string, number> = {};
    
    workout.exercises.forEach(exercise => {
      const exerciseInfo = exerciseData.find(e => e.id === exercise.workoutIndex);
      if (exerciseInfo) {
        const target = exerciseInfo.target;
        let volume = 0;
        
        exercise.sets.forEach(set => {
          if (set.completed) {
            volume += set.weight * set.rep;
          }
        });
        
        if (target) {
          if (muscleGroupVolume[target]) {
            muscleGroupVolume[target] += volume;
          } else {
            muscleGroupVolume[target] = volume;
          }
        }
      }
    });
    
    return muscleGroupVolume;
  };
  
  // Handle workout deletion with confirmation
  const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
    Alert.alert(
      "Delete Workout",
      `Are you sure you want to delete "${workoutName}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteWorkout(workoutId);
            // If the deleted workout was selected, close the modal
            if (selectedWorkout?.id === workoutId) {
              setSelectedWorkout(null);
            }
          }
        }
      ]
    );
  };
  
  // Render workout card
  const renderWorkoutCard = ({ item }: { item: CompletedWorkout }) => {
    const totalWeight = calculateTotalWeight(item);
    const completedSets = calculateCompletedSets(item);
    
    return (
      <View style={styles.workoutCardContainer}>
        <TouchableOpacity 
          style={styles.workoutCard}
          onPress={() => setSelectedWorkout(item)}
        >
          <View style={styles.workoutCardHeader}>
            <Text style={styles.workoutName}>{item.name}</Text>
            <Text style={styles.workoutDate}>{formatDate(item.date)}</Text>
          </View>
          
          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={18} color="#34A6FB" />
              <Text style={styles.statValue}>{formatDuration(item.duration)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            
            <View style={styles.statItem}>
              <FontAwesome5 name="dumbbell" size={16} color="#34A6FB" />
              <Text style={styles.statValue}>{totalWeight} kg</Text>
              <Text style={styles.statLabel}>Volume</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="counter" size={18} color="#34A6FB" />
              <Text style={styles.statValue}>{completedSets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
          </View>
          
          <Text style={styles.exerciseCount}>
            {item.exercises.length} exercise{item.exercises.length !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
        
        {/* Delete button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteWorkout(item.id, item.name)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4757" />
        </TouchableOpacity>
      </View>
    );
  };
  
  // Workout detail modal
  const renderWorkoutDetailModal = () => {
    if (!selectedWorkout) return null;
    
    const muscleGroupVolume = calculateMuscleGroupVolume(selectedWorkout);
    
    return (
      <Modal
        visible={!!selectedWorkout}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedWorkout(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setSelectedWorkout(null)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="white" />
            </Pressable>
            <Text style={styles.modalTitle}>{selectedWorkout.name}</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Workout Summary</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <FontAwesome5 name="calendar-alt" size={20} color="#34A6FB" />
                  <Text style={styles.summaryValue}>{formatDate(selectedWorkout.date)}</Text>
                  <Text style={styles.summaryLabel}>Date</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Ionicons name="time-outline" size={20} color="#34A6FB" />
                  <Text style={styles.summaryValue}>{formatDuration(selectedWorkout.duration)}</Text>
                  <Text style={styles.summaryLabel}>Duration</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <FontAwesome5 name="dumbbell" size={20} color="#34A6FB" />
                  <Text style={styles.summaryValue}>{calculateTotalWeight(selectedWorkout)} kg</Text>
                  <Text style={styles.summaryLabel}>Total Volume</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons name="counter" size={20} color="#34A6FB" />
                  <Text style={styles.summaryValue}>{calculateCompletedSets(selectedWorkout)}</Text>
                  <Text style={styles.summaryLabel}>Sets Completed</Text>
                </View>
              </View>
            </View>
            
            {Object.keys(muscleGroupVolume).length > 0 && (
              <View style={styles.volumeSection}>
                <Text style={styles.sectionTitle}>Volume by Muscle Group</Text>
                <View style={styles.volumeChart}>
                  {Object.entries(muscleGroupVolume)
                    .sort(([, volumeA], [, volumeB]) => volumeB - volumeA)
                    .map(([muscle, volume]) => (
                      <View key={muscle} style={styles.volumeItem}>
                        <Text style={styles.muscleName}>{muscle}</Text>
                        <View style={styles.volumeBarContainer}>
                          <View 
                            style={[
                              styles.volumeBar, 
                              { 
                                width: `${Math.min(100, (volume / Math.max(...Object.values(muscleGroupVolume))) * 100)}%`
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.volumeValue}>{volume} kg</Text>
                      </View>
                    ))
                  }
                </View>
              </View>
            )}
            
            <View style={styles.exercisesSection}>
              <Text style={styles.sectionTitle}>Exercises</Text>
              {selectedWorkout.exercises.map((exercise, index) => {
                const exerciseInfo = exerciseData.find(e => e.id === exercise.workoutIndex);
                const completedSets = exercise.sets.filter(set => set.completed).length;
                const totalSets = exercise.sets.length;
                
                return (
                  <View key={index} style={styles.exerciseItem}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseCount}>{completedSets}/{totalSets} sets</Text>
                    </View>
                    
                    <View style={styles.setsContainer}>
                      {exercise.sets.map((set, setIndex) => (
                        <View 
                          key={setIndex} 
                          style={[
                            styles.setItem, 
                            set.completed ? styles.completedSet : styles.incompleteSet
                          ]}
                        >
                          <Text style={styles.setText}>{setIndex + 1}</Text>
                          <Text style={styles.setText}>{set.weight} kg</Text>
                          <Text style={styles.setText}>{set.rep} reps</Text>
                          {set.completed ? (
                            <AntDesign name="checkcircle" size={16} color="#4CAF50" />
                          ) : (
                            <AntDesign name="closecircle" size={16} color="#F44336" />
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34A6FB" />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
      </View>
      
      {workoutHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="history" size={60} color="#555" />
          <Text style={styles.emptyText}>No workout history yet</Text>
          <Text style={styles.emptySubtext}>Complete your first workout to see it here</Text>
        </View>
      ) : (
        <FlatList
          data={workoutHistory.slice().reverse()} // Most recent workouts first
          renderItem={renderWorkoutCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {renderWorkoutDetailModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111113",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#111113",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  listContent: {
    padding: 15,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
  workoutCard: {
    backgroundColor: "#1D2125",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  workoutDate: {
    fontSize: 12,
    color: "#999",
  },
  workoutStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
  },
  exerciseCount: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#111113",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 34,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  summarySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryItem: {
    width: "48%",
    backgroundColor: "#1D2125",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#999",
  },
  
  // Volume chart styles
  volumeSection: {
    marginBottom: 25,
  },
  volumeChart: {
    backgroundColor: "#1D2125",
    borderRadius: 10,
    padding: 15,
  },
  volumeItem: {
    marginBottom: 12,
  },
  muscleName: {
    fontSize: 14,
    color: "white",
    marginBottom: 5,
  },
  volumeBarContainer: {
    height: 10,
    backgroundColor: "#2D2D2D",
    borderRadius: 5,
    overflow: "hidden",
  },
  volumeBar: {
    height: "100%",
    backgroundColor: "#34A6FB",
    borderRadius: 5,
  },
  volumeValue: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
    alignSelf: "flex-end",
  },
  
  // Exercises section styles
  exercisesSection: {
    marginBottom: 20,
  },
  exerciseItem: {
    backgroundColor: "#1D2125",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  setsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
  },
  setItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  completedSet: {
    opacity: 1,
  },
  incompleteSet: {
    opacity: 0.5,
  },
  setText: {
    fontSize: 14,
    color: "white",
  },
});
