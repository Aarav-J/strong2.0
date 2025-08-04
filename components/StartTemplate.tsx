import { useStore } from '@/store';
import { Template } from '@/types';
import { Image } from 'expo-image';
import React from 'react';
// import { useStore } from '@/store';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { imageMap } from './ExerciseList/imageMap';
const StartTemplate = ({template, visible, onClose, onBegin}: {template: Template, visible: boolean, onClose: () => void, onBegin: () => void}) => { 
    const exerciseData = useStore((state) => state.exerciseData);
    const insets = useSafeAreaInsets();
    const startWorkout = useStore((state) => state.startWorkout);
    return ( 
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.container, { paddingTop: insets.top }]}>
                    <View style={styles.headerContainer}>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </Pressable>
                        <Text style={styles.title}>Start Template</Text>
                        
                        <View style={styles.placeholder} />
                    </View>
                    
                    <ScrollView style={styles.content}>
                        <Text style={styles.templateName}>{template?.templateName || 'Template'}</Text>
                        {/* <Text style={styles.subtitle}>Exercises in this template:</Text> */}
                        
                        {template?.exercises?.map((exercise, index) => {
                            const exerciseName = exerciseData[exercise.exerciseId]?.name || 'Unknown Exercise';
                            return (
                                <View key={index} style={styles.exerciseItem}>
                                
                                    <Image
                                        source={imageMap[exerciseData[exercise.exerciseId]?.image_path?.replace(".jpg", "_thumbnail.png") || '']}
                                        style={styles.exerciseImage}
                                    />
                                    <View>
                                        <Text style={styles.exerciseName}>{exercise.sets} x {exerciseName}</Text>
                                        <Text style={styles.exerciseDetails}>
                                            {exerciseData[exercise.exerciseId]?.target || 'Unknown Type'}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                        <Pressable style={styles.startButton} onPress={() => { 
                            console.log(template.key)
                            startWorkout(template.templateName, template.key+1)
                            onBegin(); 
                        }}>
                            <Text style={styles.startButtonText}>Start Workout</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({ 
    exerciseImage: { 
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    container: { 
        backgroundColor: "#111113",
        width: '90%',
        height: '80%',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        paddingBottom: 20,
        elevation: 8,
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#111113',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    templateName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#ccc',
        marginBottom: 15,
    },
    exerciseItem: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 5,
    },
    exerciseDetails: {
        fontSize: 14,
        color: '#34A6FB',
    },
    startButton: {
        backgroundColor: '#34A6FB',
        paddingVertical: 16,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default StartTemplate;