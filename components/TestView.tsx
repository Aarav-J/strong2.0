
import { useStore } from '@/store';
import { Pressable, StyleSheet, Text, View } from 'react-native';
const TestView = () => { 
    const numpadVisible = useStore((state) => state.numpadVisible);
    const setNumpadVisible = useStore((state) => state.setNumpadVisible);
    const activeInputId = useStore((state) => state.activeInputId);
    if (!numpadVisible) return null
    return ( 
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text>{activeInputId}</Text>
                <Pressable style={styles.button} onPress={() => setNumpadVisible(!numpadVisible)}>
                    <Text>{numpadVisible ? 'Hide Numpad' : 'Show Numpad'}</Text>
                </Pressable>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: { 
        width: '100%',
        height: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1F2526",
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        padding: 16,
    }, 
    innerContainer: { 
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#34A6FB',
        padding: 10,
        borderRadius: 8,
        margin: 10,
    },
    text: {
        color: 'white',
        fontSize: 18,
    },    
});
export default TestView;