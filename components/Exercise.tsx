import { useStore } from '@/store';
import { ExerciseDetail } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import Rest from './Rest';
import Set from './Set';
type Props = { 
    // name: string; 
    exerciseDetails: ExerciseDetail
};

export default function Exercise({ exerciseDetails }: Props) {
    const name = exerciseDetails.name
    const key = exerciseDetails.key
    const addSet = useStore((state) => state.addSet)
    return (
        <View style={styles.exerciseContainer}>
            <View style={{paddingHorizontal: 20}}>
                <Text style={styles.exerciseName}>{name}</Text>
            </View>
            <View style={styles.headerCells}>
                <View style={[styles.headerTextContainer, {width: "10%", justifyContent: "flex-start"}]}><Text style={styles.headerText}>Set</Text></View>
                <View style={[{width: "35%"}, styles.headerTextContainer]}><Text style={styles.headerText}>Previous</Text></View>
                <View style={[{width: "20%"}, styles.headerTextContainer]}><Text style={styles.headerText}>Reps</Text></View>
                <View style={[{width: "20%"}, styles.headerTextContainer]}><Text style={styles.headerText}>Weight</Text></View>
                <View style={[{width: "10%"}, styles.headerTextContainer]}><FontAwesome name="check" size={16} color="white" /></View>
            </View>
            <View style={styles.setContainer}>
            {exerciseDetails.sets.map((set, index) => (
                    <View key={index} style={{}}>
                        <Set
                            // key={set.key}
                            parentKey={key}
                            set={set}
                        /> 

                        <Rest 
                            // key={set.key}
                            parentKey={key}
                            set={set}
                            // active={true} // Highlight last set as active
                            // duration={30} // Example duration, can be dynamic
                        />
                        
                    </View>
            ))}
            </View>
            <View style={styles.addSetContainer}>
                <Button title="Add Set" icon="plus" onPress={() => addSet(key)} backgroundColor='#222' />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({ 
    exerciseContainer: { 
        flexDirection: "column",
        width: "100%", 
    
        // backgroundColor: "red",

    },
    setContainer: { 
        flexDirection: "column",
        // gap: 8,
        // backgroundColor: "red",
    },
    addSetContainer: { 
        paddingHorizontal: 20, 
        marginTop: 4,
    },
    highlight: { 
        backgroundColor: "#34A6FB",
    },
    headerCells: { 
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 16,
        // alignItems: "flex-end",
        paddingHorizontal: 25,
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