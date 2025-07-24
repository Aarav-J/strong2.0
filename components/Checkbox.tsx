import { useStore } from "@/store"
import { FontAwesome } from "@expo/vector-icons"
import { useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
type Props = {
    parentKey: number, 
    keyNumber: number
}
export default function Checkbox({parentKey, keyNumber}: Props) {
    const [checked, setChecked] = useState(false)
    const setNext = useStore((state) => state.setNext)
    const setActiveSet = useStore((state) => state.setActiveSet)
    const activeSet = useStore((state) => state.activeSet)
    const setCompletedElement = useStore((state) => state.setCompletedElement)
    const workoutDetails = useStore((state) => state.workoutDetails)
    const setActiveInputId = useStore((state) => state.setActiveInputId)
    const handleCheck = () => { 
        if(checked == false) {
            //  let tempActiveSet = [...activeSet]
            //  tempActiveSet[2] = 1
            setCompletedElement([parentKey, keyNumber, 0])
            setActiveSet([parentKey, keyNumber, 1])
            if(activeSet[2] == 1) { 
                setCompletedElement(activeSet)
            }
            setActiveInputId(null)
        } else  { 
            setActiveSet([parentKey, keyNumber, 0])
            setCompletedElement([parentKey, keyNumber, 0])
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