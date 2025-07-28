import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const Exercises = () => { 
    const [csvData, setCsvData] = useState<any[]>([]);
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
                header: true, // If your CSV has headers
                skipEmptyLines: true,
                delimiter: ',',
            });
            
            console.log('Parsed CSV data:', result.data);
            setCsvData(result.data);
            
        } catch (error) {
            console.error('Error loading CSV:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load CSV on component mount
    useEffect(() => {
        loadCsv();
    }, []);

    return ( 
        <View style={styles.container}>
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
            
            Display first few exercises
            {/* {csvData.slice(0, 3).map((exercise, index) => (
                <Text key={index} style={styles.text}>
                    {JSON.stringify(exercise)}
                </Text>
            ))} */}
        </View>
    );
};

export default Exercises;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111113',
        padding: 20,
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
    },
});