import { Exercise as ExerciseType } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { imageMap } from "./imageMap";

const ExerciseInfo = ({exercise, onClose}: {exercise: ExerciseType, onClose: () => void}) => { 
    if (!exercise) {
        return null;
    }

    // Function to render equipment items
    const renderEquipmentItems = () => {
        console.log(typeof(exercise.equipment));
        if (!exercise.equipment) return "No equipment needed";
        const s = "['example 1', 'example2']";
        const matches = [...exercise.equipment.toString().matchAll(/'([^']*)'/g)].map(m => m[1]);
        const equipmentList = Array.isArray(exercise.equipment) 
            ? exercise.equipment 
            : [exercise.equipment];

        return matches.join(", ");
    };

    const generateDirections = () => { 
        // console.log(typeof(exercise.directions));
        // if (!exercise.directions) return "No directions available";
        return [...exercise.directions.toString().matchAll(/'([^']*)'/g)].map(m => m[1]); 
        // return exercise.directions;
        // console.log("b " + directionArr);
        // console.log("l " + typeof(directionArr));
        // return [" set 1", "set 2", "set 3"];
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <AntDesign name="close" size={24} color="white" />
                    </Pressable>
                    <Text style={styles.title}>{exercise.name}</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Image 
                        source={imageMap[exercise.image_path]} 
                        contentFit="contain" 
                        style={styles.exerciseImage} 
                    />

                    {/* Target Muscle Section */}
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Target Muscle</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>{exercise.target}</Text>
                        </View>
                    </View>

                    {/* Equipment Section */}
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Equipment Needed</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>{renderEquipmentItems()}</Text>
                        </View>
                    </View>

                    {/* Instructions Section */}
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <View style={styles.infoContainer}>
                            {generateDirections().map((direction, index) => (
                                <Text key={index} style={[styles.infoText, {color: "white"}]}><Text style={{color: "#34A6FB"}}>{index + 1}.</Text> {direction}</Text>
                            ))}
                        </View>
                        {/* <Text style={styles.description}>{exercise.directions}</Text> */}
                    </View>
                </ScrollView>
                
                {/* <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Start Exercise</Text>
                    </Pressable>
                </View> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: { 
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    container: {
        width: "90%",
        height: "90%",
        backgroundColor: "#1F2526",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    headerContainer: { 
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingVertical: 10,
    },
    closeButton: {
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    placeholder: {
        width: 34, // Same width as close button to center title
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    exerciseImage: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginBottom: 24,
    },
    infoSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    infoContainer: {
        backgroundColor: "#2A2D30",
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        flexDirection: "column",
        gap: 8, 

    },
    infoText: {
        fontSize: 16,
        color: "#34A6FB",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    description: {
        fontSize: 16,
        color: "#ccc",
        lineHeight: 24,
        textAlign: "left",
        backgroundColor: "#2A2D30",
        borderRadius: 8,
        padding: 16,
    },
    buttonContainer: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#333",
    },
    button: {
        backgroundColor: "#34A6FB",
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ExerciseInfo;