import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Rest from './Rest';
import Set from './Set';
type Props = { 
    name: string; 
    workoutDetails: Array<{ 
        sets: { 
            previous: string; 
            reps: number; 
            weight: number; 
        }[]; 
    }>;
};

export default function Exercise({ name, workoutDetails }: Props) {
    return (
        <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseName}>{name}</Text>
            <View style={styles.headerCells}>
                <View style={[styles.headerTextContainer, {width: "10%", justifyContent: "flex-start"}]}><Text style={styles.headerText}>Set</Text></View>
                <View style={[{width: "35%"}, styles.headerTextContainer]}><Text style={styles.headerText}>Previous</Text></View>
                <View style={[{width: "20%"}, styles.headerTextContainer]}><Text style={styles.headerText}>Reps</Text></View>
                <View style={[{width: "20%"}, styles.headerTextContainer]}><Text style={styles.headerText}>Weight</Text></View>
                <View style={[{width: "10%"}, styles.headerTextContainer]}><FontAwesome name="check" size={16} color="white" /></View>
            </View>
            {workoutDetails.map((detail, index) => (
                <View key={index} style={styles.setContainer}>
                    {detail.sets.map((set, setIndex) => (
                        <>
                        <Set
                            key={setIndex}
                            number={setIndex + 1}
                            previous={set.previous}
                            weight={set.weight}
                            reps={set.reps}
                            highlight={set.highlight}
                        />
                        <Rest 
                            key={`rest-${setIndex}`}
                            active={true} // Highlight last set as active
                            duration={60} // Example duration, can be dynamic
                        />
                        </>
                    ))}
                    
                </View>
            ))}
        </View>
    );
}


const styles = StyleSheet.create({ 
    exerciseContainer: { 
        flexDirection: "column",

    },
    setContainer: { 
        flexDirection: "column",
        gap: 4,
        // backgroundColor: "red",
    },
    highlight: { 
        backgroundColor: "#34A6FB",
    },
    headerCells: { 
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 16,
        // paddingHorizontal: 4,
        // backgroundColor: "#222",
        borderRadius: 8,
        marginBottom: 8,
        color: "white",
    },
    headerText: { 
        fontWeight: "bold",
        color: "white", 
        fontSize: 16
    },
    headerTextContainer: { 
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        color: "white",
    },
    exerciseName: { 
        fontSize: 20, 
        fontWeight: "bold",
        color: "#34A6FB"
    }
})