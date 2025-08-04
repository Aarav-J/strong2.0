import { useStore } from '@/store';
import { Exercise as ExerciseType } from '@/types';
import { filterExercises, fuzzySearch } from '@/utils/utils';
import { AntDesign } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Papa from 'papaparse';
import { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExerciseInfo from './ExerciseList/ExerciseInfo';
import ExercisePreview from './ExerciseList/ExercisePreview';
import Filter from './ExerciseList/Filter';

const AddExerciseModal = ({addExerciseModalVisible, setAddExerciseModalVisible}: {addExerciseModalVisible: boolean, setAddExerciseModalVisible: (visible: boolean) => void}) => { 
    const insets = useSafeAreaInsets();
    const [exerciseData, setExerciseData] = useState<ExerciseType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedInfoExerciseId, setSelectedInfoExerciseId] = useState<number | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterChoices, setFilterChoices] = useState<string[][]>([[], []]);   
    const addWorkout = useStore((state) => state.addExercise);
    const [chosenExercises, setChosenExercises] = useState<number[]>([]);

    const loadCsv = async () => {
        try {
            setLoading(true);
            
            const asset = Asset.fromModule(require('../assets/exercises.csv'));
            await asset.downloadAsync();
            
            const csvContent = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
            
            const result = Papa.parse(csvContent, {
                header: true,
                skipEmptyLines: true,
                delimiter: ',',
            });
            
            setExerciseData(result.data as ExerciseType[]);
            
        } catch (error) {
            console.error('Error loading CSV:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCsv();
    }, []);

    const renderExercise = ({item}: {item: ExerciseType}) => {
        return (
            <Pressable onPress={() => {
                console.log("Selected Exercise: ", item.name);
                // setSelectedInfoExerciseId(item.id);
                if(chosenExercises.includes(item.id)) {
                    setChosenExercises(prev => prev.filter(id => id !== item.id));
                }else { 
                    setChosenExercises(prev => [...prev, item.id]);
                }
                
                // setAddExerciseModalVisible(false);
            }} style={[chosenExercises.includes(item.id) && {backgroundColor: '#257aba90'}]}>
                <ExercisePreview exercise={item} isModal={true} setSelectedInfoExerciseId={setSelectedInfoExerciseId} hideExerciseModal={() => setAddExerciseModalVisible(false)} chosenExercises={chosenExercises} setChosenExercises={setChosenExercises} />
            </Pressable>
        );
    };

    return (
        <>
            <Modal
                visible={addExerciseModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setAddExerciseModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.container, { paddingTop: insets.top }]}>
                        <View style={styles.headerContainer}>
                            <Pressable onPress={() => setAddExerciseModalVisible(false)} style={styles.closeButton}>
                                <AntDesign name="close" size={24} color="white" />
                            </Pressable>
                            <Text style={styles.modalTitle}>Add Exercise</Text>
                            <Pressable onPress={() => {
                                if (chosenExercises.length > 0) {
                                    chosenExercises.forEach(exerciseId => {
                                        addWorkout(exerciseData[exerciseId])
                                    })
                                    setChosenExercises([]); // Clear chosen exercises after adding
                                }
                                setAddExerciseModalVisible(false);
                            }}>
                                <Text style={[styles.addButtonText, chosenExercises.length >= 1 ? {color: '#34A6FB'} : {color: 'grey'}]}>Add</Text>
                            </Pressable>
                        </View>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={[styles.searchInput, isActive && styles.activeInput]}
                                placeholder="Search exercises..."
                                returnKeyType="done"
                                placeholderTextColor="#666"
                                onFocus={() => setIsActive(true)}
                                onBlur={() => setIsActive(false)}
                                value={searchQuery}
                                onChangeText={(text) => setSearchQuery(text)}
                            />
                            <Filter filterChoices={filterChoices} setFilterChoices={setFilterChoices} />
                            <Text style={styles.text}>
                                Loaded {exerciseData.length} exercises
                            </Text>
                        </View>
                               
                        <View style={styles.listContainer}>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <Text style={styles.text}>Loading exercises...</Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={searchQuery ? fuzzySearch(filterExercises(exerciseData, filterChoices), searchQuery) : filterExercises(exerciseData, filterChoices)}
                                    renderItem={renderExercise}
                                    keyExtractor={(item) => `${item.id}`}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.listContent}
                                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Render ExerciseInfo within this component */}
            {selectedInfoExerciseId && (
                <ExerciseInfo 
                    exerciseId={selectedInfoExerciseId} 
                    setSelectedInfoExercise={setSelectedInfoExerciseId} 
                    setAddExerciseModalVisible={setAddExerciseModalVisible}
                />
            )}
        </>
    );
}

// ... rest of your styles remain the same

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%', 
        height: '85%',
        backgroundColor: '#111113',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
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
    addButtonText: { 
        // color: 'grey', 
        fontSize: 16,
        fontWeight: "light",
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#111113',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#111113',
        width: "100%",
    },
    listContent: {
        // paddingHorizontal: 20,
        // paddingVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        opacity: 0.7,
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
        // marginVertical: 10,
    },
    searchInput: { 
        width: '100%',
        height: 50,
        backgroundColor: '#222',
        borderRadius: 8,
        paddingHorizontal: 15,
        color: 'white',
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeInput: { 
        borderColor: '#34A6FB',
        borderWidth: 2,
    }
});

export default AddExerciseModal;