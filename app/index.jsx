import { Text, View, StyleSheet, Image, TextInput, FlatList } from "react-native";
import { Icon } from "react-native-elements";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import { db } from "../FirebaseConfig";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold
} from "@expo-google-fonts/poppins";

const HomeScreen = () => {
  const router = useRouter();

  useFonts({
    Poppins_400Regular,
    Poppins_700Bold
  });

  const [foodItems, setFoodItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const itemsCollection = collection(db, 'items');

  useEffect(() => {
      fetchItems();
  }, [searchValue]);

  const fetchItems = async () => {
      const q = query(itemsCollection, where("name", ">=", searchValue.toLowerCase()), where("name", "<=", searchValue.toLowerCase() + "\uf8ff"));
      const data = await getDocs(q);
      setFoodItems(data.docs.map((doc) => {
          return {...doc.data(), id: doc.id}
      }));
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Search..."
        value={searchValue}
        onChangeText={text => {
            fetchItems();
            setSearchValue(text);
        }}
        style={styles.searchBar}
        placeholderTextColor={"white"}
      />
      <FlatList
        data = {foodItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <View style={styles.foodItem}>
                <Image 
                    style={styles.image}
                    source={{uri: item.image}}
                />
                <View style={styles.foodTextContainer}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodLocation}>{item.location}</Text>
                </View>

                <Icon
                  raised
                  name="arrow-forward"
                  type="material-icons"
                  size={20}
                  onPress={() => router.push({
                    pathname: "/kitchen",
                    params: { name: item.name, location: item.location, image: item.image }
                  })}
                  color={"#6b0000"}
                />
            </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "column",
  },

  foodItem: {
      flexDirection: "row",
      justifyContent: "flex-start",
      backgroundColor: "#fbe3ab",
      padding: 15,
      borderRadius: 15,
      marginVertical: 5,
      elevation: 3
  },

  foodTextContainer: {
      flex: 2,
      flexDirection: "column",
      backgroundColor: "#fbe3ab",
      marginLeft: 20
  },

  foodName: {
      fontSize: 20,
      fontFamily: "Poppins-Bold"
  },

  foodLocation: {
      fontSize: 17,
      color: "#383838",
      fontFamily: "Poppins-Regular"
  },

  image: {
      height: 50,
      width: 50,
      marginVertical: 5,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      elevation: 2
  },

  searchBar: {
      backgroundColor: "#282828",
      borderRadius: 15,
      color: "white",
      padding: 15,
      marginBottom: 10,
      fontSize: 20,
      elevation: 5,
      fontFamily: "Poppins-Regular"
  },
});

export default HomeScreen;