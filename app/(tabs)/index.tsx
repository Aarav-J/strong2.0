import StartTemplate from "@/components/StartTemplate";
import WorkoutModal from "@/components/WorkoutModal";
import WorkoutTab from "@/components/WorkoutTab";
import { useStore } from '@/store';
import { Exercise, Template } from "@/types";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { returnExerciseData } from "@/utils/utils";
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
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const selectedInfoExercise = useStore((state) => state.selectedInfoExercise);
  const setSelectedInfoExercise = useStore((state) => state.setSelectedInfoExercise);
  const setExerciseData = useStore((state) => state.setExerciseData);
  const exerciseData = useStore((state) => state.exerciseData);
  const startWorkout = useStore((state) => state.startWorkout);
  const loadWorkoutHistory = useStore((state) => state.loadWorkoutHistory);
  const workoutDetails = useStore((state) => state.workoutDetails);
  // const startWorkout = () => {
  //   setIsWorkoutActive(true);
  //   setWorkoutModalVisible(true);
  // };

  const endWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutModalVisible(false);
  };
   useEffect(() => {
      try { 
        returnExerciseData().then((data: Exercise[] | undefined) => { 
          if (data) {
            console.log("fetched")
            setExerciseData(data);
          }
        })
      } catch (error) {
        console.error("Error fetching exercise data:", error);
      }
      
      // Load workout history from AsyncStorage
      loadWorkoutHistory();
      
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
    
    // Update workout active state based on workoutDetails
    useEffect(() => {
      setIsWorkoutActive(!!workoutDetails);
    }, [workoutDetails]);
  const templates = useStore((state) => state.templates);

  return (
    <View style={styles.container}>
      {/* Placeholder content */}
      <View style={styles.content}>
        <Text style={styles.title}>Stronger</Text>
        <View style={styles.contentBox}>
          <Text style={styles.subtitle}>Quick Start</Text>
          {!isWorkoutActive && (
            <Pressable style={styles.startButton} onPress={() => { 
              startWorkout("midday workout");
              setWorkoutModalVisible(true);
               setIsWorkoutActive(true);
            }}>
              <Text style={styles.startButtonText}>Start Workout</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.contentBox}>
          <Text style={styles.subtitle}>Templates</Text>
          <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap', justifyContent: "space-between"}}>
          {templates.map((template) => {
            return (
            <Pressable 
              key={template.key} 
              style={styles.templateButton} 
              onPress={() => {
                setSelectedTemplate(template);
                setTemplateModalVisible(true);
                // setWorkoutModalVisible(true);
                // useStore.getState().setTemplate(template);
              }}
            >
              <View>
                <Text style={styles.templateButtonText}>{template.templateName}</Text>
                <Text style={styles.templateButtonSubtitle}>
                  {template.exercises.slice(0, 10).map((exercise, index) => {
                    const exerciseName = exerciseData[exercise.exerciseId]?.name || 'Unknown Exercise';
                    return index === 0 ? `${exerciseName}` : `, ${exerciseName}`;
                  }).join('')}
                </Text>
                  {/* </Text> */}
              </View>
            </Pressable>
          )
          })
        }
        </View>
        </View>

        {/* {isWorkoutActive && (
          <Pressable style={styles.endButton} onPress={endWorkout}>
            <Text style={styles.endButtonText}>End Workout</Text>
          </Pressable>
        )} */}
      </View>

      {/* Workout Tab */}
      <WorkoutTab
        onPress={() => setWorkoutModalVisible(true)}
        isActive={isWorkoutActive}
      />

      {/* Workout Modal */}
      <WorkoutModal
        visible={workoutModalVisible}
        onClose={() => setWorkoutModalVisible(false)}
      />
      {selectedTemplate && <StartTemplate template={selectedTemplate} visible={templateModalVisible} onClose={() => setTemplateModalVisible(false)} onBegin={() => { 
        setTemplateModalVisible(false); 
        setIsWorkoutActive(true);
      }}/>}
       {/* {selectedInfoExercise && <ExerciseInfo exerciseId={selectedInfoExercise} setSelectedInfoExercise={setSelectedInfoExercise} />} */}
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    backgroundColor: "#111113",
    flex: 1,
    width: '100%',
    height: '100%',

  },
  content: {
    flex: 1,
    marginTop: 80,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  templateButton: { 
    backgroundColor: 'transparent', 
    padding: 12, 
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    width: "48%",
    borderColor: 'silver',
    // width: '100%',
  }, 
  templateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',

  }, 
  templateButtonSubtitle: {
    fontSize: 14,
    color: 'grey',
  },
  
  title: {
    fontSize: 52,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 36,
    // color: '#999',
    fontWeight: '600',
    color: "white",
    textAlign: 'center',
    marginBottom: 15,
  },
  contentBox: { 
    width: "100%",
    marginBottom: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  startButton: {
    backgroundColor: '#34A6FB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    textAlign: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
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