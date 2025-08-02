import WorkoutModal from "@/components/WorkoutModal";
import WorkoutTab from "@/components/WorkoutTab";
import { useStore } from '@/store';
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
Notifications.setNotificationHandler({ 
  handleNotification: async () => ({ 
    shouldPlaySound: false, 
    shouldSetBadge: true, 
    shouldShowBanner: true, 
    shouldShowList: true, 
  })
});


export default function Index() {
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const workoutName = "Midday Workout";
  const selectedInfoExercise = useStore((state) => state.selectedInfoExercise);
  const setSelectedInfoExercise = useStore((state) => state.setSelectedInfoExercise);
  const startWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutModalVisible(true);
  };

  const endWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutModalVisible(false);
  };
   useEffect(() => {
    
      AsyncStorage.setItem("startDate", new Date().toISOString());
      registerForPushNotificationsAsync();

      if (Platform.OS === 'android') {
        Notifications.getNotificationChannelsAsync();
      }
      
      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification);
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

      return () => {
        notificationListener.remove();
        responseListener.remove();
      
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Placeholder content */}
      <View style={styles.content}>
        <Text style={styles.title}>AaravStrong</Text>
        {/* <Text style={styles.subtitle}>Your fitness journey starts here</Text> */}
        
        {!isWorkoutActive && (
          <Pressable style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </Pressable>
        )}

        {/* {isWorkoutActive && (
          <Pressable style={styles.endButton} onPress={endWorkout}>
            <Text style={styles.endButtonText}>End Workout</Text>
          </Pressable>
        )} */}
      </View>

      {/* Workout Tab */}
      <WorkoutTab
        workoutName={workoutName}
        onPress={() => setWorkoutModalVisible(true)}
        isActive={isWorkoutActive}
      />

      {/* Workout Modal */}
      <WorkoutModal
        visible={workoutModalVisible}
        onClose={() => setWorkoutModalVisible(false)}
        workoutName={workoutName}
      />
       {/* {selectedInfoExercise && <ExerciseInfo exerciseId={selectedInfoExercise} setSelectedInfoExercise={setSelectedInfoExercise} />} */}
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    backgroundColor: "#111113",
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#34A6FB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  endButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  endButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});