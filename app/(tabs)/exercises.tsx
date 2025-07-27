import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const Exercises = () => { 

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

    return ( 
        <View style={styles.container}>

            <Image
        style={styles.image}
        source={require('../../assets/images/barbell_curls.jpg')}
        // placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />

           
        </View>
    )
}
export default Exercises


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111113',
        // justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    image: {
    flex: 1,
    width: '100%',
    // height: '20%',
    backgroundColor: '#0553',
  },
})