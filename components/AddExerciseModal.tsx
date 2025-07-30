import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const AddExerciseModal = () => { 
    // const { addExerciseModalVisible, setAddExerciseModalVisible } = useStore();
    const [addExerciseContainerVisible, setAddExerciseModalVisible] = useState(true);
    const insets = useSafeAreaInsets();
    
    return (
        <Modal
        visible={addExerciseContainerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddExerciseModalVisible(false)}
        >
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
            {/* Your modal content goes here */}
            <Text style={{color: "white"}}>Add Exercise Modal</Text>
            <Pressable onPress={() => setAddExerciseModalVisible(false)}>
            <Text>Close</Text>
            </Pressable>
        </View>
        </Modal>
    );
}
export default AddExerciseModal;