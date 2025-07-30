import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ElapsedTime from "./ElapsedTime";
type props = { 
    title: string; 
    
}

export default function Header({title}: props) {
    
    const [date, setDate] = useState<Date | null>(null);  
    const [secondsRunning, setSecondsRunning] = useState<number | null>(null);
    useEffect(() => { 
        !date && AsyncStorage.getItem("startDate").then((startDate) => {
        if (startDate) {
            console.log("Start Date:", startDate);
            const startDateTime = new Date(startDate);
            setDate(startDateTime);
            
        }
        });
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
                    <Text style={styles.date}>{date?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <FontAwesome name="clock-o" size={16} color="white" />
                    <ElapsedTime textStyles={styles.time} />
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