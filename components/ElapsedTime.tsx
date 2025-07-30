import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

const ElapsedTime = ({textStyles}: {textStyles: any}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [secondsRunning, setSecondsRunning] = useState<number | null>(null);
  useEffect(() => {
    !date && AsyncStorage.getItem("startDate").then((startDate) => {
      if (startDate) {
        console.log("Start Date:", startDate);
        const startDateTime = new Date(startDate);
            setDate(startDateTime);
            
            // Start the interval immediately after setting the date
            const interval = setInterval(() => { 
                const now = new Date();
                const diff = Math.floor((now.getTime() - startDateTime.getTime()) / 1000);
                setSecondsRunning(diff);
            }, 1000);
            
            // Clean up function
            return () => clearInterval(interval);
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
        <Text style={textStyles}>{formatTime(secondsRunning || 0)}</Text>
    )
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default ElapsedTime;