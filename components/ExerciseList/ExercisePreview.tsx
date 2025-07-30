import { Exercise as ExerciseType } from "@/types";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { imageMap } from "./imageMap";

const ExercisePreview = ({exercise}: {exercise: ExerciseType}) => {
    // Add early return if exercise is undefined
    if (!exercise) {
        return null;
    }

    useEffect(() => { 
        // console.log("Exercise " + JSON.stringify(exercise))
    }, [exercise])

    const imageName = exercise.image_path?.replace(".jpg", "_thumbnail.png") || "";
    const imageSource = imageMap[imageName];

    return (
        <View style={styles.container}>
            {imageSource ? (
                <Image
                    source={imageSource}
                    style={styles.image}
                />
            ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
            <View style={styles.textContainer}>
                <Text style={styles.name}>{exercise.name || 'Unknown Exercise'}</Text>
                <Text style={styles.details}>{exercise.target || 'No target specified'}</Text>
            </View>
        </View>
    )
}

export default ExercisePreview;



const styles = StyleSheet.create({
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    placeholderImage: {
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#666',
        fontSize: 12,
    },
    container: { 
        flexDirection: "row", 
        width: "100%", 
        alignItems: "center",
        justifyContent: "flex-start", 
        backgroundColor: "transparent", 
    }, 
    textContainer: { 
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: 10,
        width: "70%",
        alignItems: "flex-start", // Changed from center for better alignment
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff"
    },
    details: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
})