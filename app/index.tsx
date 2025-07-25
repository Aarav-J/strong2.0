import Button from "@/components/Button";
import CompletedModal from "@/components/CompletedModal";
import Exercise from "@/components/Exercise";
import Header from "@/components/Header";
import Numpad from "@/components/Numpad";
import { useStore } from "@/store";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
Notifications.setNotificationHandler({ 
  handleNotification: async () => ({ 
    shouldPlaySound: false, 
    shouldSetBadge: true, 
    shouldShowBanner: true, 
    shouldShowList: true, 
  })
})
export default function Index() {
  const [visible, setVisible] = useState(false);
  const startDate = new Date();
  const workoutDetails = useStore((state) => state.workoutDetails);
  const numpadVisible = useStore((state) => state.numpadVisible);
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const restCompletedVisible = useStore((state) => state.restCompletedVisible);
  const setRestCompletedVisible = useStore((state) => state.setRestCompletedVisible);
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

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
              onPress={() => console.log('Add Exercise Pressed')}
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
    <CompletedModal visible={restCompletedVisible} setVisible={setRestCompletedVisible}/>
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