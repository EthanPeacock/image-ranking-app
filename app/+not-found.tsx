import { Link, Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<SafeAreaView>
				<Text>This screen does not exist.</Text>
				<Link href="/">
					<Text>Go to home screen!</Text>
				</Link>
			</SafeAreaView>
		</>
	);
}
