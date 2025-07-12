import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
type Props = { 
    active: boolean; 
    duration: number;   
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
export default function Rest({active, duration}: Props) {
    const width = useSharedValue(1); // 1 means 100%
   
    const [remainingTime, setRemainingTime] = useState(duration);

    useEffect(() => { 
        let timer: ReturnType<typeof setInterval>;
        if (active) {
            setRemainingTime(duration);
            width.value = 1; // reset width to full when activated
            width.value = withTiming(0, { 
                duration: duration * 1000, 
                easing: Easing.linear
            });
            timer = setInterval(() => {
                setRemainingTime((prev) => {
                    if(prev <= 0) { 
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [active, duration, width]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${width.value * 100}%`,
    }));

    return (active ? (
        <View style={styles.activeContainer}>
            <Animated.View style={[styles.timerContainer, animatedStyle]}></Animated.View>
            <Text style={styles.activeText}>{formatTime(remainingTime)}</Text>
        </View>
    ) :  (
        <View style={styles.inactiveContainer}>
            <View style ={styles.blueLine}></View>
            <Text style={styles.inactiveText}>{formatTime(remainingTime)}</Text>
            <View style ={styles.blueLine}></View>
        </View>
    ))
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
        // backgroundSize: ""
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
        
        height: "20%",
        width: "40%",
        backgroundColor: "#2D5472",
        // marginHorizontal: 8,
    },
    inactiveContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    inactiveText: {
        color: "#34A6FB",
        fontSize: 16,
        // fontWeight: "bold"
    },
});