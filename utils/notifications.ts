import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
export async function schedulePostNotification({title, body, endTs}: {title: string, body: string, endTs: Date}): Promise<string> { 
    const notificationId = await Notifications.scheduleNotificationAsync({ 
        content: {
            title: title, 
            body: body, 
            data: {data: 'goes here', test: {test1: "more data"}}
        }, 
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(endTs.getTime() + 10), // Use the endTs date plus 10ms for the trigger
        }
    })
    return notificationId;
}
export async function registerForPushNotificationsAsync() {
    let token; 
    if(Platform.OS === 'android') { 
        await Notifications.setNotificationChannelAsync('myNotificationChannel', { 
            name: "A channel is needed for the permissions promt to appear", 
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        })
    }
    if(Device.isDevice) { 
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus; 
        if(existingStatus !== 'granted') { 
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if(finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        try { 
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectID; 
            if(!projectId) { 
                throw new Error("Project ID not found in EAS config");
            }
            token = (
                await Notifications.getExpoPushTokenAsync({projectId})
            ).data;
            console.log(token)
        } catch (error) { 
            token = `${error}`;
        }
    } else { 
        alert('Must use physical device for Push Notifications');
    }
    return token; 
}