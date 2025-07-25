import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}
const CompletedModal = ({visible, setVisible}: Props) => { 
    useEffect(() => { 
        if(!visible) return;
        const timer = setTimeout(() => setVisible(false), 1500);
        return () => clearTimeout(timer);
    }, [visible])
    return (
        <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => 
            setVisible(false) 
        }>
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Text style={styles.emojiTitle}>🏋️</Text>
            <View style={styles.messageContainer}>
                <Text style={styles.modalTitle}>Rest Completed!</Text>
                <Text style={styles.modalMessage}>Get back to work!</Text>
            </View>
            </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
    },
    emojiTitle: { 
        fontSize: 50,
        // marginBottom: 20,
        textAlign: "center",
        color: "white",
    },
    modalContent: {
        width: "70%",
        // backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        backgroundColor: "#1F2526",
        gap: 15,
    },
    messageContainer: { 
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        // marginTop: 10,
        // marginBottom: 20,
        gap: 10,
    },
    modalTitle: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
    },
    modalMessage: {
        fontSize: 16,
        // marginVertical: 10,
        color: "grey",
    },
});

export default CompletedModal;