import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { PropsWithChildren } from 'react';
import { useStore } from '@/store';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
type Props = { 
    handlePressKey: (digit: string) => void  
    handlePressDelete: () => void
    // onClose: () => void; 
}

export default function Numpad({handlePressKey, handlePressDelete}: Props) {
    const numpadVisible = useStore((state) => state.numpadVisible);
    const activeInputId = useStore((state) => state.activeInputId);
    const setNumpadVisible = useStore((state) => state.setNumpadVisible);
    const setActiveInputId = useStore((state) => state.setActiveInputId);
    const handleNumpadKeyPress = useStore((state) => state.handleNumpadKeyPress);
    const handleNumpadDelete = useStore((state) => state.handleNumpadDelete);
    const currentSelection = useStore((state) => state.currentSelection || { start: 0, end: 0 });

    if(!numpadVisible || !activeInputId) return null;

    const onClose = () => { 
        setNumpadVisible(false);
        setActiveInputId(null);
    };

    const onKeyPress = (key: string) => {
        const result = handleNumpadKeyPress(key, currentSelection);
        if (result) {
            // Update the current selection to reflect the new cursor position
            useStore.setState({ 
                currentSelection: { 
                    start: result.newCursor, 
                    end: result.newCursor 
                }
            });
        }
    };

    const onDelete = () => {
        const result = handleNumpadDelete(currentSelection);
        if (result) {
            // Update the current selection to reflect the new cursor position
            useStore.setState({ 
                currentSelection: { 
                    start: result.newCursor, 
                    end: result.newCursor 
                }
            });
        }
    };
    return ( 
                <View style={styles.modalContainer}>
                    <View style={styles.numpadContainer}>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('1')}>
                            <Text style={styles.buttonText}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('2')}>
                            <Text style={styles.buttonText}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('3')}>
                            <Text style={styles.buttonText}>3</Text>
                        </TouchableOpacity>
                         <Pressable style={({pressed}) => [
                            styles.numpadButton, 
                            pressed && styles.numpadButtonPressed
                            ]} onPress={onClose}>
                            <MaterialIcons name="keyboard-hide" size={18} color="white" />
                        </Pressable>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('4')}>
                            <Text style={styles.buttonText}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('5')}>
                            <Text style={styles.buttonText}>5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('6')}>
                            <Text style={styles.buttonText}>6</Text>
                        </TouchableOpacity>
                        <Pressable style={({pressed}) => [
                            styles.numpadButton, 
                            pressed && styles.numpadButtonPressed
                            ]} onPress={onClose}>
                            <Ionicons name="barbell-sharp" size={18} color="white" />
                        </Pressable>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('7')}>
                            <Text style={styles.buttonText}>7</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('8')}>
                            <Text style={styles.buttonText}>8</Text>   
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('9')}>
                            <Text style={styles.buttonText}>9</Text>
                        </TouchableOpacity>
                        <View style={styles.plusMinusContainer}>
                            <Pressable style={({pressed}) => [styles.plusminusButton, styles.plus, pressed && styles.numpadButtonPressed]}>
                                <Feather name="plus" size={18} color="white"/>
                            </Pressable>
                            <Pressable style={({pressed}) => [styles.plusminusButton, styles.minus, pressed && styles.numpadButtonPressed]}>
                                <Feather name="minus" size={20} color="white"/>
                            </Pressable>

                         </View>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('.')}>
                            <Text style={styles.buttonText}>.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.numpadNumber} onPress={() => onKeyPress('0')}>
                            <Text style={styles.buttonText}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.numpadNumber} onPress={onDelete}>
                            <Feather name="delete" size={18} color="white" />
                        </TouchableOpacity>
                         <Pressable style={({pressed}) => [styles.numpadButton, styles.actionButton, pressed && styles.numpadButtonPressed]} onPress={onClose}>
                           <Text style={{color: "white", fontWeight: "bold", fontSize: 18}}>Next</Text>
                        </Pressable>
                    </View>
                    {/* <View style ={styles.numpadButtons}>

                        <Pressable style={styles.numpadButton} onPress={() => onClose()}>
                            <MaterialIcons name="keyboard-hide" size={14} color="white" />
                        </Pressable>
                         <Pressable style={styles.numpadButton} onPress={() => onClose()}>
                            <Ionicons name="barbell-sharp" size={14} color="white" />
                        </Pressable>
                         <View style={styles.plusMinusContainer}>
                            <Pressable style={styles.plusminusButton}>
                                <Feather name="plus" size={14} color="white"/>
                            </Pressable>
                            <Pressable style={styles.plusminusButton}>
                                <Feather name="minus" size={12} color="white"/>
                            </Pressable>

                         </View>
                         <Pressable style={styles.numpadButton} onPress={() => onClose()}>
                            <MaterialIcons name="keyboard-hide" size={18} color="white" />
                        </Pressable>
                    </View> */}
                </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        // flex: 1,
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

    numpadContainer: { 
        // backgroundColor: 'red', 
        width: '100%', 
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    numpadButtons: { 
        flexDirection: 'column',
        // backgroundColor: 'blue', 
        height: '100%',
        width: '30%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    numpadNumber: { 
        // width: 50,
        width: "20%",
        // height: 50,
        height: "15%",
        // backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 25,
        margin: 10,
        // borderWidth: 1,
        // color: 'white',
    }, 
    numpadButton: { 
        backgroundColor: '#3d4d54',
        paddingVertical: 10,
        // height: 50,
        width: '20%',
        // width: '80%',
        borderRadius: 5,
        // marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    numpadButtonPressed: { 
        opacity: 0.3,
    },
    plusMinusContainer: { 
        width: "20%", 
        // justifyContent: "space-between", 
        justifyContent: "space-around",
        flexDirection: "row", 
        alignItems: "center",
        gap: 1, 
        // backgroundColor: "red"
    },
    plusminusButton: { 
        backgroundColor: "#3d4d54", 
        borderRadius: 5,
        
        width: '50%', 
        height: 30, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    plus: { 
        borderTopEndRadius: 0, 
        borderBottomEndRadius: 0,
    }, 
    minus: { 
        borderTopStartRadius: 0, 
        borderBottomStartRadius: 0,   
    }, 
    actionButton: { 
        backgroundColor: "#34A6FB" 
    }, 
    buttonText: { 
        color: 'white',
        fontSize: 20,
        fontWeight: '600'
    }
})