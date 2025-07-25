import { useStore } from "@/store"
import { cancelRestNotification } from "@/utils/notifications"
import { FontAwesome } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"

type Props = {
    parentKey: number, 
    keyNumber: number
}

export default function Checkbox({parentKey, keyNumber}: Props) {
    const workoutDetails = useStore((state) => state.workoutDetails)
    const setNext = useStore((state) => state.setNext)
    const setActiveSet = useStore((state) => state.setActiveSet)
    const activeSet = useStore((state) => state.activeSet)
    const setCompletedElement = useStore((state) => state.setCompletedElement)
    const setActiveInputId = useStore((state) => state.setActiveInputId)
    const resetRestTimer = useStore((state) => state.resetRestTimer)

   
    const currentSet = workoutDetails[parentKey]?.sets[keyNumber]
    const [checked, setChecked] = useState(currentSet?.completed || false)

    useEffect(() => {
        setChecked(currentSet?.completed || false)
    }, [currentSet?.completed])

    const handleCheck = async () => { 
        cancelRestNotification();
        
        if(!checked) {
            
            setCompletedElement([parentKey, keyNumber, 0])
            setActiveSet([parentKey, keyNumber, 1])
            
           
            if(activeSet[2] == 1) { 
                setCompletedElement(activeSet)
            }
            setActiveInputId(null)
        } else  { 
            
            setActiveSet([parentKey, keyNumber, 0])
            setCompletedElement([parentKey, keyNumber, 0])
            
            
            resetRestTimer(parentKey, keyNumber)
            
    
            if(workoutDetails[parentKey].sets[keyNumber].rest.completed) { 
                setCompletedElement([parentKey, keyNumber, 1])
            }
        }
        
        setChecked(!checked)
    }

    return ( 
        <View style={styles.checkContainer}>
            <Pressable style={checked ? styles.checkedButton : styles.checkButton} onPress={handleCheck}>
                <FontAwesome name="check" size={18} color="white"/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({ 
    checkedButton: {
        alignItems: "center",
        justifyContent: "center", 
        color: "white", 
        width: "100%", 
        height: "100%",
        borderRadius: 8,
        backgroundColor: "#2ECD70", 
    },
    checkContainer: { 
        
        borderRadius: 8,
        width: "100%", 
        // paddingVertical: 8, 
        height: "100%"
    }, 
    
    checkButton: { 
        alignItems: "center",
        justifyContent: "center", 
        color: "white", 
        width: "100%", 
        height: "100%",
        borderRadius: 8,
        backgroundColor: "#222", 
    }
    
})