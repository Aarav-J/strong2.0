import { useStore } from '@/store';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ElapsedTime from './ElapsedTime';
type Props = {
//   workoutName: string;
  onPress: () => void;
  isActive: boolean;
};

export default function WorkoutTab({ onPress, isActive }: Props) {
  const insets = useSafeAreaInsets();
  const workoutDetails = useStore((state) => state.workoutDetails);
  if (!isActive) return null;

  return (
    <View style={[styles.container, { bottom: 0 }]}>
      <Pressable style={styles.tab} onPress={onPress}>
        <View style={styles.tabContent}>
          {/* <View style={styles.indicator} /> */}
          <Text style={styles.workoutName}>{workoutDetails?.name || "midday workout"}</Text>
          {/* <Ionicons name="chevron-up" size={20} color="white" /> */}
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <ElapsedTime textStyles={styles.elapsedTime} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    // right: 20,
    zIndex: 1000,
    width: '100%',
  },
  elapsedTime: { 
    fontSize: 18,
    color: 'grey',
    // marginLeft: 8,
  },
  tab: {
    borderTopColor: "silver",
    borderTopWidth: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 12,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: -2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 8,
    // elevation: 5,
    
  },
  tabContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: "100%",
    height: "100%",
    gap: 6,
    // backgroundColor: "red"
    // flexGrow: 1,
  },
 
  workoutName: {
    // flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
});
