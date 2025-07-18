import { ExerciseSet } from "@/types";
import { StyleSheet, Text, View } from "react-native";
import Checkbox from "./Checkbox";
import NumpadInput from "./NumpadInput";
type Prop = {
    parentKey: number; 
    // key: number; 
    set: ExerciseSet
    highlight?: boolean;
}
export default function Set({parentKey, set }: Prop)  { 
    const previous = null; 
    return (
        <View style={{backgroundColor: set.completed ? "rgba(46, 205, 112, 0.33)" : undefined}}>
            <View style={[styles.setContainer, set.completed && styles.highlight]}>
                <View style={[set.completed ? styles.setCompletedNumberContainer : styles.setNumberContainer]}><Text style={styles.setText}>{set.key+1}</Text></View>
                <View style={[styles.previousContainer]}><Text style={styles.setText}>{previous == "" ? "-" : previous}</Text></View>
                <View style={[styles.repContainer]}>
                    <NumpadInput 
                        value={set.rep.toString()}
                        onChangeText={(text) => {
                        const num = parseInt(text) || 0;
                        // Add your store update logic here
                        console.log('New value:', num);
                        }} 
                        inputId={`set-${parentKey}-${set.key}-rep`}
                    />
                </View>
                <View style={[styles.weightContainer]}>
                    <Text style={styles.setText}>
                        {set.weight}
                    </Text>
                </View>
                <View style={[styles.hContainer]}><Checkbox parentKey={parentKey} keyNumber={set.key}/></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    setContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderRadius: 8,
        // marginBottom: 4,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: "100%"
        
    },
    setNumberContainer: { 
        width: "10%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
        borderRadius: 8,
        paddingVertical: 4,
    },
    setCompletedNumberContainer: { 
        width: "10%", 
        justifyContent: "center", 
        alignItems: "center",
        paddingVertical: 4,
    },
    previousContainer: { 
        width: "35%", 
        justifyContent: "center",
        alignItems: "center",
    },
    repContainer: { 
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    weightContainer: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    hContainer: {
        width: "10%",
        height: 30, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    highlight: { 
        // backgroundColor:"rgba(46, 205, 112, 0.33)",
    },
    setText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold"
    },
});