import { Stack } from "expo-router";

const RootLayout = () => {
  return <Stack 
    screenOptions={{
      headerStyle: {
        backgroundColor: "#ff9100"
      },
      headerTintColor: "black",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold"
      },
      contentStyle: {
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: "#fff"
      }
  }}>
    <Stack.Screen name="index" options={{title: "Home"}} />
    <Stack.Screen name="search" options={{headerTitle: "Item Search"}} />
    <Stack.Screen name="kitchen" options={{headerTitle: "My Kitchen"}} />
    <Stack.Screen name="map" options={{headerTitle: "Kitchen Map"}} />
  </Stack>
};

export default RootLayout;
