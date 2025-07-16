import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type props = { 
    title: string; 
    startDate: Date; 
}

export default function Header({title, startDate}: props) {
    const date = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [secondsRunning, setSecondsRunning] = useState(0);
    
    useEffect(() => { 
        const interval = setInterval(() => { 
            setSecondsRunning((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const formatTime = (seconds: number) => { 
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {/* <View style={styles.dateContainer}> */}
                <View style={styles.infoContainer}> 
                    <FontAwesome name="calendar" size={16} color="white" />
                    <Text style={styles.date}>{date}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <FontAwesome name="clock-o" size={16} color="white" />
                    <Text style={styles.time}>{formatTime(secondsRunning)}</Text>
                </View>
            {/* </View> */}
        </View>
    );
}

const styles = StyleSheet.create({ 
    header: {
        // padding: 16,
        // backgroundColor: "#222",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        gap: 8,
        // backgroundColor: "red",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
    },
    dateContainer: {
        
        
    },
    infoContainer: { 
        flexDirection: "row",
        alignItems: "center",
        gap: 4, 
        color: "#E8FEF9",
    },
    date: {
        marginLeft: 4,
        color: "white",
    },
    time: {
        marginLeft: 8,
        color: "white",
    },
})