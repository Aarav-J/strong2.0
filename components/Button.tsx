import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = { 
    title: string; 
    icon?:  keyof typeof FontAwesome.glyphMap; 
    onPress?: () => void;
    color?: string;
    backgroundColor?: string;
}

export default function Button({title, icon, onPress, color="white", backgroundColor}: Props) {
    return (
        <Pressable 
            style={[styles.button, {backgroundColor: backgroundColor}]} 
            onPress={onPress}
        >
            <View style={styles.content}>
                {icon && <FontAwesome name={icon} size={20} color={color} />}
                <Text style={[styles.text, {color: color}]}>{title}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        padding: 12,
        elevation: 2,
        // borderWidth: 1,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        marginLeft: 8,
        fontWeight: "bold",
    },
});