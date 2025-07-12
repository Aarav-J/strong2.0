import { StyleSheet, Text, View } from "react-native";
type Prop = {
    number: number; 
    previous: string; 
    weight: number;
    reps: number; 
    highlight?: boolean;
}

export default function Set({ number, previous, weight, reps, highlight }: Prop)  { 
    return (
        <View style={[styles.setContainer, highlight && styles.highlight]}>
            <View style={[styles.setNumberContainer]}><Text style={styles.setText}>{number}</Text></View>
            <View style={[styles.previousContainer]}><Text style={styles.setText}>{previous == "" ? "-" : previous}</Text></View>
            <View style={[styles.repContainer]}><Text style={styles.setText}>{reps}</Text></View>
            <View style={[styles.weightContainer]}><Text style={styles.setText}>{weight}</Text></View>
            <View style={[styles.hContainer]}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    setContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 4,
    },
    setNumberContainer: { 
        width: "10%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222",
        borderRadius: 8,
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
    },
    highlight: { 
        backgroundColor: "#34A6FB",
    },
    setText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
});