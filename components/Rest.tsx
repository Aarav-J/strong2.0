import { useStore } from '@/store';
import { ExerciseSet } from '@/types';
import { schedulePostNotification } from '@/utils/notifications';
import { compareArrays } from '@/utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
type Props = { set: ExerciseSet; parentKey: number };

const Rest = ({ set, parentKey }: Props) => {
  const duration = set.rest.duration;
  const storageKey = `restTimerEnd-${parentKey}-${set.key}`;
  const notificationIdRef = useRef<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(duration);
  const [completed, setCompleted] = useState<boolean>(set.rest.completed);
  const intervalRef = useRef<number | null>(null);
  const width = useSharedValue<number>(1);
  const activeSet = useStore(state => state.activeSet);
  const setNext = useStore(state => state.setNext);
  const setCompletedElement = useStore(state => state.setCompletedElement);
  const setRestCompletedVisible = useStore(state => state.setRestCompletedVisible);
  // Sync completed flag
  useEffect(() => {
    setCompleted(set.rest.completed);
  }, [set.rest.completed]);

  // On mount and app resume, re-sync any existing timer
  useEffect(() => {
    syncTimerFromStorage();
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      sub.remove();
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [duration]);

  // Start timer when this set becomes active
  useEffect(() => {
    if (compareArrays(activeSet, [parentKey, set.key, 1])) {
      initializeTimer();
    }
  }, [activeSet, duration]);

  // Handle completion side-effect
  useEffect(() => {
    if (
      compareArrays(activeSet, [parentKey, set.key, 1]) &&
      remainingTime === 0 &&
      !completed
    ) {
      setCompletedElement([parentKey, set.key, 1]);
      setNext();
      if (AppState.currentState === 'active') {
        if (notificationIdRef.current) {
          Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
          notificationIdRef.current = null;
        }
        setRestCompletedVisible(true);
      }
    }
  }, [remainingTime, activeSet, completed]);

  const handleAppStateChange = (state: AppStateStatus) => {
    if (state === 'active') {
      syncTimerFromStorage();
    }
  };

  const initializeTimer = async () => {
    const now = Date.now();
    const endTsNumber = now + duration * 1000;
    const endTs = new Date(endTsNumber);
    await AsyncStorage.setItem(storageKey, endTsNumber.toString());
    notificationIdRef.current = await schedulePostNotification({
      title: 'Rest Completed',
      body: 'Time to get back to work!',
      data: {
        type: 'rest',
        key: `${parentKey}-${set.key}`,
      },
      endTs: endTs,
    });
    startSyncedTimer(endTsNumber);
  };

  const syncTimerFromStorage = async () => {
  const stored = await AsyncStorage.getItem(storageKey);
  if (!stored) {
    setRemainingTime(duration);
    width.value = 1;
    return;
  }
  const endTsNumber = parseInt(stored, 10);
  if (endTsNumber <= Date.now()) {
    await AsyncStorage.removeItem(storageKey);
    setRemainingTime(0);
    width.value = 0;
  } else {
    // Calculate the correct width based on remaining time
    const now = Date.now();
    const remainingMs = endTsNumber - now;
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const progressRatio = remainingMs / (duration * 1000);
    
    // Set the width to match the remaining time
    width.value = progressRatio;
    setRemainingTime(remainingSeconds);
    
    // Continue the animation from current position
    width.value = withTiming(0, { 
      duration: remainingMs, 
      easing: Easing.linear 
    });
    
    // Start the interval timer
    intervalRef.current = setInterval(() => {
      const msLeft = endTsNumber - Date.now();
      if (msLeft <= 0) {
        clearInterval(intervalRef.current!);
        AsyncStorage.removeItem(storageKey);
        setRemainingTime(0);
      } else {
        setRemainingTime(Math.ceil(msLeft / 1000));
      }
    }, 1000);
  }
};

  const startSyncedTimer = (endTsNumber: number) => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    const now = Date.now();
    const remainingMs = endTsNumber - now;
    width.value = 1;
    width.value = withTiming(0, { duration: remainingMs, easing: Easing.linear });
    setRemainingTime(Math.ceil(remainingMs / 1000));
    intervalRef.current = setInterval(() => {
      const msLeft = endTsNumber - Date.now();
      if (msLeft <= 0) {
        clearInterval(intervalRef.current!);
        AsyncStorage.removeItem(storageKey);
        setRemainingTime(0);
      } else {
        setRemainingTime(Math.ceil(msLeft / 1000));
      }
    }, 1000);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={[completed ? styles.completedContainer : undefined]}>
      <View style={{ paddingHorizontal: 20 }}>
        {compareArrays(activeSet, [parentKey, set.key, 1]) ? (
          <View style={styles.activeContainer}>
            <Animated.View style={[styles.timerContainer, animatedStyle]} />
            <Text style={styles.activeText}>{formatTime(remainingTime)}</Text>
          </View>
        ) : (
          <View style={styles.inactiveContainer}>
            <View style={completed ? styles.greenLine : styles.blueLine} />
            <Text style={[styles.inactiveText, completed && styles.greenText]}>  
              {formatTime(duration)}
            </Text>
            <View style={completed ? styles.greenLine : styles.blueLine} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#2D5472',
    position: 'relative',
    width: '100%',
    height: 40,
    zIndex: 1,
    marginVertical: 4,
  },
  completedContainer: {
    backgroundColor: 'rgba(46, 205, 112, 0.33)',
  },
  timerContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#34A6FB',
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  activeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  blueLine: { 
    borderRadius: 8,
    height: '20%',
    width: '43%',
    backgroundColor: '#2D5472',
  },
  greenLine: { 
    borderRadius: 8,
    height: '20%', 
    width: '43%', 
    backgroundColor: '#2ECD70'
  },
  inactiveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  inactiveText: {
    color: '#34A6FB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  greenText: {
    color: '#2ECD70',
  },
});

export default Rest;