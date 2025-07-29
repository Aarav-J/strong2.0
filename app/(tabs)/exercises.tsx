import ExercisePreview from '@/components/ExerciseList/ExercisePreview';
import { Exercise as ExerciseType } from '@/types';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
// import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';

const Exercises = () => { 
    const [csvData, setCsvData] = useState<ExerciseType[]>([]);
    const [loading, setLoading] = useState(false);
    
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
            
            console.log('Parsed CSV data:', result.data);
            setCsvData(result.data as ExerciseType[]);
            
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
        return <ExercisePreview key={index} exercise={item} />;
    };

    return ( 
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image
                    style={styles.image}
                    source={require('../../assets/images/barbell_curls_thumbnail.png')}
                    contentFit="fill"
                    transition={1000}
                />
                <Button 
                    title={loading ? "Loading..." : "Reload CSV"} 
                    onPress={loadCsv}
                    disabled={loading}
                />
                <Text style={styles.text}>
                    Loaded {csvData.length} exercises
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
                        data={csvData}
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
});