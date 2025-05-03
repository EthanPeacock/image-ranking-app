import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export default function RankCategory({ stars }: { stars: number }) {
	const theme = useTheme();

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				marginBottom: 24
			}}
		>
			{Array.from({ length: stars }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<MaterialIcons key={index} name="star" size={42} color={theme.colors.primary} />
			))}
		</View>
	);
}
