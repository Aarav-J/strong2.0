import ExerciseInfo from '@/components/ExerciseList/ExerciseInfo';
import ExercisePreview from '@/components/ExerciseList/ExercisePreview';
import { Exercise as ExerciseType } from '@/types';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
// import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';
import Filter from '@/components/ExerciseList/Filter';
import { filterExercises, fuzzySearch } from '@/utils/utils';

const Exercises = () => { 
    const [exerciseData, setExerciseData] = useState<ExerciseType[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [filterChoices, setFilterChoices] = useState<string[][]>([[], []]); 
    const [selectedId, setSelectedId] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const loadCsv = async () => {
        try {
            setLoading(true);
            
            // Load the CSV asset
            const asset = Asset.fromModule(require('../../assets/exercises.csv'));
            await asset.downloadAsync();
            
            // Read the file content
            const csvContent = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
            
            // Parse with PapaParse
            const result = Papa.parse(csvContent, {
                header: true,
                skipEmptyLines: true,
                delimiter: ',',
            });
            
            // console.log('Parsed CSV data:', result.data);
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

    const renderExercise = ({item, index}: {item: ExerciseType, index: number}) => {
        return (
            <Pressable onPress={() => {setSelectedId(index); setShowModal(true);}}>
                <ExercisePreview key={index} exercise={item} />
            </Pressable>
        );
    };

    return ( 
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TextInput
                    style={[styles.searchInput, isActive && styles.activeInput]}
                    placeholder="Search exercises..."
                    returnKeyType="done"
                    placeholderTextColor="#666"
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                    }}
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
                ) : 
                (
                    
                    <FlatList
                        data={searchQuery ? fuzzySearch(filterExercises(exerciseData, filterChoices), searchQuery) : filterExercises(exerciseData, filterChoices)}
                        renderItem={renderExercise}
                        keyExtractor={(item, index) => `${item.id}`}
                        // contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )
                }
            </View>  

        {showModal && <ExerciseInfo exercise={exerciseData[selectedId]} onClose={() => {setShowModal(false)}}/>}
        </View>
        
        
        
           
            
            
            
          
    );
};

export default Exercises;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111113',
    },
    headerContainer: {
        paddingTop: 60, // Account for status bar
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#111113',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#111113',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
        marginVertical: 5,
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        backgroundColor: '#0553',
        marginBottom: 20,
        borderRadius: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 10,
    },
    searchInput: { 
        width: '100%',
        height: 50,
        backgroundColor: '#222',
        borderRadius: 8,
        paddingHorizontal: 15,
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
    },
    activeInput: { 
        borderColor: 'white',
        borderWidth: 2,
    }
});