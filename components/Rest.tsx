import { useStore } from "@/store";
import { ExerciseSet } from "@/types";
import { schedulePostNotification } from "@/utils/notifications";
import { compareArrays } from "@/utils/utils";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
type Props = { 
    set: ExerciseSet 
    parentKey: number, 
    // key: number, 
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
export default function Rest({set, parentKey}: Props) {
    const [completed, setCompleted] = useState(false)
    // const [active, setActive] = useState(true)
    const workoutDetails = useStore((state) => state.workoutDetails)
    const activeSet = useStore((state) => state.activeSet)
    const setNext = useStore((state) => state.setNext)
    const setCompletedElement = useStore((state) => state.setCompletedElement)
    const width = useSharedValue(1); // 1 means 100%
//    useEffect(() => { 

//    }, [workoutDetails[parentKey].sets[key].duration])
    const duration = set.rest.duration
    
    const [remainingTime, setRemainingTime] = useState(duration)
    const handleCompleted = async () => { 
        setCompletedElement([parentKey, set.key, 1]);
        setNext();
        setRemainingTime(duration);
        schedulePostNotification({title: "Rest Completed", body: "Time to get back to work!", delay: 1});
        console.log("rest completed")
    }
        
    // Or, if you are confident and want to avoid the cast:
    // const [remainingTime, setRemainingTime] = useState(set.duration);
    // If you want to be extra safe, you could throw if duration is missing:
    // if (typeof set.duration !== "number") throw new Error("Rest component requires set with duration");
      useEffect(() => { 
        setCompleted(set.rest.completed)
    }, [set.rest.completed])

    useEffect(() => { 
        let timer: ReturnType<typeof setInterval>;
        if (compareArrays(activeSet, [parentKey, set.key, 1])) {
            setRemainingTime(duration);
            width.value = 1; // reset width to full when activated
            width.value = withTiming(0, { 
                duration: duration * 1000, 
                easing: Easing.linear
            });
            timer = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [activeSet,duration, width]);

    // NEW: handle completion as a side effect
    useEffect(() => {
        if (
            compareArrays(activeSet, [parentKey, set.key, 1]) &&
            remainingTime === 0 &&
            !completed
        ) {
            handleCompleted();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remainingTime, activeSet, completed]);
    const animatedStyle = useAnimatedStyle(() => ({
        width: `${width.value * 100}%`,
    }));

    return (
        <View style={[completed ? styles.completedContainer : null]}>
            <View style={{paddingHorizontal: 20}}>
            {compareArrays(activeSet, [parentKey, set.key, 1]) ? (
                <View style={styles.activeContainer}>
                <Animated.View style={[styles.timerContainer, animatedStyle]}></Animated.View>
                <Text style={styles.activeText}>{formatTime(remainingTime)}</Text>
            </View>
            ) :  (
            <View style={styles.inactiveContainer}>
                <View style ={completed ? styles.greenLine : styles.blueLine}></View>
                <Text style={[styles.inactiveText, completed && styles.greenText]}>{formatTime(duration)}</Text>
                <View style ={completed ? styles.greenLine : styles.blueLine}></View>
            </View> 
        )}
            </View>
            </View>
    )
}



const styles = StyleSheet.create({
    activeContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // padding: 16,
        // backgroundColor: "#34A6FB",
        borderRadius: 8,
        backgroundColor: "#2D5472",
        position: "relative",
        width: "100%",
        height: 40,
        zIndex: 1,
        marginTop: 4,
        marginBottom: 4,
        // paddingHorizontal: 30, 
        // backgroundSize: ""
    },
    completedContainer: { 
        backgroundColor: 'rgba(46, 205, 112, 0.33)',
    },
    timerContainer: { 
        width: "100%", 
        height: "100%",
        backgroundColor: "#34A6FB",
        borderRadius: 8,
        position: "absolute",
        top: 0,
        left: 0,
        // padding: 1,

        zIndex: -1,
        // opacity: 1,
    },
    activeText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    blueLine: { 
        borderRadius: 8,
        height: "20%",
        width: "43%",
        backgroundColor: "#2D5472",
        // marginHorizontal: 8,
    },
    greenLine: { 
        borderRadius: 8,
        height: "20%", 
        width: "43%", 
        backgroundColor: "#2ECD70"
    },
    inactiveContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        // paddingHorizontal: 30, 
    },
    inactiveText: {
        color: "#34A6FB",
        fontSize: 16,
        fontWeight: "bold"
    },
    greenText: { 
        color: '#2ECD70'
    }
});