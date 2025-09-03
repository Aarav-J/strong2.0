import { useStore } from '@/store';
import { ExerciseDetail } from '@/types';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Button from './Button';
import Rest from './Rest';
import Set from './Set';
type Props = { 
    // name: string; 
    exerciseDetails: ExerciseDetail
};

export default function Exercise({ exerciseDetails }: Props) {
    const key = exerciseDetails.key;
    const addSet = useStore((state) => state.addSet);
    const updateExerciseName = useStore((state) => state.updateExerciseName);
    
    const [isEditing, setIsEditing] = useState(false);
    const [exerciseName, setExerciseName] = useState(exerciseDetails.name);
    const [isSaving, setIsSaving] = useState(false); // Track if we're saving to prevent cancel on blur
    
    // Update local state when the exercise name changes from props
    useEffect(() => {
        setExerciseName(exerciseDetails.name);
    }, [exerciseDetails.name]);
    
    const handleSaveName = () => {
        setIsSaving(true); // Mark that we're saving to prevent cancel
        if (exerciseName.trim()) {
            updateExerciseName(key, exerciseName);
        } else {
            // If empty, reset to the original name
            setExerciseName(exerciseDetails.name);
        }
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        if (!isSaving) { // Only cancel if we're not already saving
            setExerciseName(exerciseDetails.name);
            setIsEditing(false);
        }
        setIsSaving(false); // Reset the saving flag
    };
    
    return (
        <View style={styles.exerciseContainer}>
            <View style={styles.nameContainer}>
                {isEditing ? (
                    <View style={styles.editNameContainer}>
                        <TextInput
                            style={styles.nameInput}
                            value={exerciseName}
                            onChangeText={setExerciseName}
                            autoFocus
                            selectionColor="#34A6FB"
                            placeholderTextColor="#888"
                            placeholder="Exercise Name"
                            returnKeyType="done"
                            onSubmitEditing={handleSaveName}
                            onBlur={handleCancel}
                            blurOnSubmit={false}
                            maxLength={30} // Limit the input length
                        />
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity 
                                style={styles.iconButton} 
                                onPress={handleCancel}
                            >
                                <Feather name="x" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.iconButton} 
                                onPress={handleSaveName}
                            >
                                <Feather name="check" size={20} color="#34A6FB" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.nameDisplay}
                        onPress={() => setIsEditing(true)}
                    >
                        <Text style={styles.exerciseName}>{exerciseDetails.name}</Text>
                        <Feather name="edit-2" size={16} color="#34A6FB" />
                    </TouchableOpacity>
                )}
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
    },
    nameContainer: {
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    nameDisplay: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 5,
    },
    editNameContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 5,
    },
    nameInput: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#34A6FB",
        flex: 1,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#34A6FB",
        marginRight: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 5,
        marginLeft: 5,
    },
    setContainer: { 
        flexDirection: "column",
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
        paddingHorizontal: 25,
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
        color: "#34A6FB",
        marginRight: 10,
    }
})