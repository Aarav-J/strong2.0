import { Exercise as ExerciseType } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { imageMap } from "./imageMap";
type Props = { 
    exercise: ExerciseType
    isModal: boolean
    setSelectedInfoExerciseId?: (id: number) => void
    hideExerciseModal?: () => void
    chosenExercises?: number[]
    setChosenExercises?: (exercises: number[]) => void
}

const ExercisePreview = ({exercise, isModal, setSelectedInfoExerciseId, hideExerciseModal, chosenExercises, setChosenExercises}: Props) => {
    // Add early return if exercise is undefined
    if (!exercise) {
        return null;
    }



    const imageName = exercise.image_path?.replace(".jpg", "_thumbnail.png") || "";
    const imageSource = imageMap[imageName];

    return (
        <Pressable onPress={() => { 
            if (setChosenExercises && chosenExercises) {
                let tempChosenExercises = [...chosenExercises];
                if(chosenExercises.includes(exercise.id)) {

                    setChosenExercises([...tempChosenExercises.filter(id => id !== exercise.id)]);
                }else { 
                    setChosenExercises([...tempChosenExercises, exercise.id]);
                }
            }
        }}>
            <View style={[styles.container, chosenExercises?.includes(exercise.id) && styles.selectedContainer]} >
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
                    {chosenExercises && chosenExercises?.includes(exercise.id) ? (
                        <FontAwesome name="check" size={24} color="#34A6FB" />
                    ) : (
                        
                        <Pressable
                        onPress={() => {
                            if (setSelectedInfoExerciseId) setSelectedInfoExerciseId(exercise.id);
                            if (hideExerciseModal) hideExerciseModal();
                        }}
                        style={styles.questionButton}>
                            <Text style={styles.questionButtonText}>?</Text>
                    </Pressable>
                    )}
                    
                </View> 
                ): ( 
                    <View style={[styles.textContainer, {marginLeft: 10}]}>
                    <Text style={styles.name}>{exercise.name || 'Unknown Exercise'}</Text>
                    <Text style={styles.details}>{exercise.target || 'No target specified'}</Text>
                </View>
                )}
                
                
            </View>
        </Pressable>
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
    selectedContainer: { 
        // backgroundColor: "#257aba90",
        // opacity: 0.2,
    },
    detailContainer: { 
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1, // Use flex instead of width: "100%"
        marginLeft: 10, // Move margin here from textContainer
    },
    container: { 
        paddingHorizontal: 20,
        paddingVertical: 5,
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