import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tela de Login</Text>
      <Button title="Entrar" onPress={() => router.replace("/(tabs)/home")} />
    </View>
  );
}