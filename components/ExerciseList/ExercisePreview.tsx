import { Exercise as ExerciseType } from "@/types";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { imageMap } from "./imageMap";

const ExercisePreview = ({exercise, isModal, setSelectedId, showModal}: {exercise: ExerciseType, isModal: boolean, setSelectedId?: (id: number) => void, showModal?: () => void}) => {
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
        <View style={[styles.container]}>
            {imageSource ? (
                <Image
                    source={imageSource}
                    style={styles.image}
                />
            ) : (
                <View style={[styles.image, styles.placeholderImage]}>
                    <Text style={[styles.placeholderText, isModal ? {fontSize: 12} : {fontSize: 14}]}>No Image</Text>
                </View>
            )}
            {isModal ? 
            ( 
            <View style={[styles.detailContainer]}>
               <View style={[styles.textContainer, {width: '70%'} ]}>
                    <Text style={styles.name}>{exercise.name || 'Unknown Exercise'}</Text>
                    <Text style={styles.details}>{exercise.target || 'No target specified'}</Text>
                </View>
                <Pressable
                    onPress={() => {
                        if (setSelectedId) setSelectedId(exercise.id);
                        if (showModal) showModal();
                    }}
                    style={styles.questionButton}>
                        <Text style={styles.questionButtonText}>?</Text>
                </Pressable>
            </View> 
            ): ( 
                <View style={[styles.textContainer, {marginLeft: 10}]}>
                <Text style={styles.name}>{exercise.name || 'Unknown Exercise'}</Text>
                <Text style={styles.details}>{exercise.target || 'No target specified'}</Text>
            </View>
            )}
            
            
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
    detailContainer: { 
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1, // Use flex instead of width: "100%"
        marginLeft: 10, // Move margin here from textContainer
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
        // flex: 1, // Use flex to take remaining space
        alignItems: "flex-start",
    },
    name: {
        // fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff"
    },
    details: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    questionButton: {
        padding: 12,
        backgroundColor: '#34A6FB',
        borderRadius: 8,
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})