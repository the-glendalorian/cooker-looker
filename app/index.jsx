import { Text, View, StyleSheet, Image, TextInput, FlatList, Pressable } from "react-native";
import { Icon } from "react-native-elements";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from '@react-native-firebase/firestore';
import { db } from "../FirebaseConfig";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

const HomeScreen = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const itemsCollection = collection(db, 'items');
  const [filteredItems, setFilteredItems] = useState([]);

  useFonts({ Poppins_400Regular, Poppins_700Bold });
  useEffect(() => {fetchItems()}, [searchValue]);

  const fetchItems = async () => {
      const q = query(itemsCollection);
      const data = await getDocs(q);
      const itemList = data.docs.map((doc) => {
        return {
          ...doc.data(), 
          id: doc.id, 
          daysLeft: getDaysLeft(doc.data()), 
          daysText: getDaysText(doc.data()), 
          daysColor: getDaysColor(doc.data()),
          days: getDays(doc.data())
        }
      });

      const allItems = itemList.sort((a, b) => {
        if (a.sus != b.sus) {
          return b.sus - a.sus;
        }
        return a.daysLeft - b.daysLeft;
      });
      setFoodItems(allItems);
      setFilteredItems(allItems.filter((item) => item.name.includes(searchValue.toLowerCase())))
  };

  const getDays = (item) => {
    return item.firstSeen.toDate().toDateString().slice(4) + " - " + item.lastSeen.toDate().toDateString().slice(4);
  }

  const getDaysLeft = (item) => {
    const ms1 = item.firstSeen.toDate().getTime();
    const ms2 = item.lastSeen.toDate().getTime();
    const timeDiff = ms2 - ms1;
    return Math.round(item.shelfLife - timeDiff / (1000 * 60 * 60 * 24));
  }

  const getDaysText = (item) => {
    const daysLeft = getDaysLeft(item);
    if (daysLeft <= 0) return "Expired";
    return daysLeft.toString() + "d left";
  }

  const getDaysColor = (item) => {
    const daysLeft = getDaysLeft(item);
    if (daysLeft <= 0) return "#fc0303";
    else if (daysLeft < 4) return "#ff7803";
    return "#3dad00";
  }

  const getSusEmoji = (item) => {
    if (item.sus == 2) return String.fromCodePoint("0x1F630");
    else if (item.sus == 1) return String.fromCodePoint("0x1F914");
    return String.fromCodePoint("0x1F600");
  }

  const getSusColor = (item) => {
    if (item.sus == 2) return "#ffb3a3";
    else if (item.sus == 1) return "#ffd3a3";
    return "#fbe3ab";
  }

  const getParams = (item) => {
    const allItems = foodItems.filter((foodItem) => foodItem.location == item.location);
    return { 
      name: item.name, 
      location: item.location, 
      image: item.image, 
      daysText: item.daysText, 
      daysColor: item.daysColor, 
      firstSeen: JSON.stringify(item.firstSeen), 
      lastSeen: JSON.stringify(item.lastSeen),
      shelfLife: item.shelfLife,
      locationImage: item.locationImage,
      id: item.id,
      allItems: JSON.stringify(allItems),
      days: item.days,
      sus: item.sus
    };
  }

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
        data = {filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({pathname: "/kitchen", params: getParams(item)})}>
            <View style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              backgroundColor: getSusColor(item),
              padding: 15,
              borderRadius: 15,
              marginVertical: 5,
              elevation: 3
            }}>
                <Image 
                  style={styles.image}
                  source={{uri: item.image}}
                />
                
                <View style={{
                  flex: 2,
                  flexDirection: "column",
                  backgroundColor: "#fbe3ab",
                  marginLeft: 20,
                  backgroundColor: getSusColor(item)
                }}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <View style={styles.foodTextbox}>
                      <Text style={styles.foodLocation}>{item.location} {getSusEmoji(item)}</Text>
                      <Text style={{
                        fontSize: 16,
                        color: "white",
                        fontFamily: "Poppins-Bold",
                        backgroundColor: item.daysColor,
                        borderRadius: 15,
                        paddingTop: 3,
                        paddingHorizontal: 10,
                      }}>{item.daysText}</Text>
                    </View>
                </View>

                <Icon
                  raised
                  name="arrow-forward"
                  type="material-icons"
                  size={20}
                  onPress={() => router.push({pathname: "/kitchen", params: getParams(item)})}
                  color={"#6b0000"}
                />
            </View>
          </Pressable>
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

  foodName: {
      fontSize: 20,
      fontFamily: "Poppins-Bold"
  },

  foodTextbox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },

  foodLocation: {
      fontSize: 17,
      color: "#383838",
      fontFamily: "Poppins-Regular",
      marginRight: 15
  },

  foodDays: {
      fontSize: 16,
      color: "#383838",
      fontFamily: "Poppins-Regular",
      backgroundColor: "#fff",
      borderRadius: 15,
      paddingTop: 3,
      paddingHorizontal: 10,
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
      elevation: 10,
      fontFamily: "Poppins-Regular"
  },
});

export default HomeScreen;