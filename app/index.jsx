import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import SpoonImage from "@/assets/images/newIcon.png";
import { useRouter } from "expo-router";
import 'setimmediate';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cooker Looker</Text>
      <Image source={SpoonImage} style={styles.image}/>
    
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push("/search")}
      >
        <Text style={styles.buttonText}>Search for an item</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button2}
        onPress={() => router.push("/kitchen")}
      >
        <Text style={styles.buttonText}>View my kitchen</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button3}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.buttonText2}>Kitchen Map</Text>
      </TouchableOpacity>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  image: {
    width: 150,
    height: 150,
    marginBottom: 50,
    borderRadius: 15
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#333",
    textAlign: "center"
  },

  button: {
    backgroundColor: '#bd0000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: 220
  },

  button2: {
    backgroundColor: '#6b0000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: 220
  },

  button3: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderColor: "#6b0000",
    borderWidth: 2,
    width: 220
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  buttonText2: {
    color: 'black',
    fontSize: 18,
  },
});

export default HomeScreen;