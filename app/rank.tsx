import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { Text, ActivityIndicator, Portal, Modal } from "react-native-paper";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolate,
	runOnJS,
	Extrapolation
} from "react-native-reanimated";
import useRankingTriplets from "@/hooks/useRankingTriplets";

type RankScreenParams = {
	albumId: string;
	method: "similarity" | "metadata";
	images: string;
}

type IconNames = "thumbs-o-up" | "thumbs-o-down" | "thumbs-up" | "thumbs-down";

export default function RankingPage() {
	const params = useLocalSearchParams<RankScreenParams>();
	const { loading, triplets, round, currTriplet, swiped, setSwiped, rating } = useRankingTriplets(
		Number.parseInt(params.albumId),
		JSON.parse(params.images),
		params.method
	);

	const [leftIcon, setLeftIcon] = useState<IconNames>("thumbs-o-down");
	const [rightIcon, setRightIcon] = useState<IconNames>("thumbs-o-up");
	const [enlargeImg, setEnlargeImg] = useState<string | null>(null);

	const { width: screenWidth } = Dimensions.get("window");
	const SWIPE_THRESHOLD = screenWidth * 0.2;
	const DURATION = 250;
	const translateX = useSharedValue(0);
	const rotateZ = useSharedValue(0);
	const opacity = useSharedValue(1);
	const placeholderImage = require("@/assets/img-placeholder.jpg");

	const handleSwipeComplete = (isRightSwipe: boolean) => {
		if (swiped) {
			// the UI is currently updating from a previous swipe
			// therefore, just ignore the current swipe and reset it
			resetCardPosition(true);
		} else {
			resetCardPosition(false);
			rating.current = isRightSwipe ? "like" : "dislike";
			setSwiped(true);
		}
	};

	const resetCardPosition = (animated = true) => {
		const timingConfig = { duration: DURATION };

		translateX.value = animated ? withTiming(0, timingConfig) : 0;
		rotateZ.value = animated ? withTiming(0, timingConfig) : 0;
		opacity.value = animated ? withTiming(1, timingConfig) : 1;

		if (leftIcon !== "thumbs-o-down") setLeftIcon("thumbs-o-down");
		if (rightIcon !== "thumbs-o-up") setRightIcon("thumbs-o-up");
	};

	const updateIconState = (tx: number) => {
		if (tx < -SWIPE_THRESHOLD) {
			if (leftIcon !== "thumbs-down") setLeftIcon("thumbs-down");
		} else {
			if (leftIcon !== "thumbs-o-down") setLeftIcon("thumbs-o-down");
		}

		if (tx > SWIPE_THRESHOLD) {
			if (rightIcon !== "thumbs-up") setRightIcon("thumbs-up");
		} else {
			if (rightIcon !== "thumbs-o-up") setRightIcon("thumbs-o-up");
		}
	};

	const panGesture = Gesture.Pan()
		.onUpdate((event) => {
			translateX.value = event.translationX;
			rotateZ.value = interpolate(
				event.translationX,
				[-screenWidth / 2, screenWidth / 2],
				[-10, 10],
				Extrapolation.CLAMP
			);
			runOnJS(updateIconState)(event.translationX);
		})
		.onEnd((event) => {
			const TOSS_DISTANCE = screenWidth * 1.5;

			if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
				const isRightSwipe = event.translationX > 0;

				translateX.value = withTiming(isRightSwipe ? TOSS_DISTANCE : -TOSS_DISTANCE, {
					duration: DURATION
				});
				rotateZ.value = withTiming(isRightSwipe ? 30 : -30, { duration: DURATION });
				opacity.value = withTiming(0, { duration: DURATION });

				runOnJS(handleSwipeComplete)(isRightSwipe);
			} else {
				runOnJS(resetCardPosition)(false);
			}
		});

	const animatedCardStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateX: translateX.value }, { rotateZ: `${rotateZ.value}deg` }]
	}));

	if (loading) {
		return (
			<>
				<Stack.Screen options={{ headerShown: false }} />
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<ActivityIndicator size="large" />
					<Text variant="titleMedium" style={{ marginTop: 16 }}>
						{round.current === 2 ? "Updating Scores..." : "Generating Triplets..."}
					</Text>
				</View>
			</>
		);
	}

	return (
		<GestureHandlerRootView>
			<View style={{ padding: 24, flex: 1, alignItems: "center" }}>
				<Stack.Screen
					options={{ headerShown: true, title: "Rank Images", headerBackVisible: false }}
				/>

				<View
					style={{ width: "100%", height: 420, justifyContent: "center", alignItems: "center" }}
				>
					<FontAwesome
						name={leftIcon}
						size={24}
						color="red"
						style={{ position: "absolute", left: -5, zIndex: 10 }}
					/>

					<GestureDetector gesture={panGesture}>
						<Animated.View
							style={[
								animatedCardStyle,
								{
									width: "80%",
									height: "100%",
									justifyContent: "center",
									alignItems: "center"
								}
							]}
						>
							<Image
								source={swiped ? placeholderImage : { uri: triplets.current[currTriplet][0] }}
								resizeMode="contain"
								style={{ width: "100%", height: 400 }}
							/>
						</Animated.View>
					</GestureDetector>

					<FontAwesome
						name={rightIcon}
						size={24}
						color="green"
						style={{ position: "absolute", right: -5, zIndex: 10 }}
					/>
				</View>

				<Text variant="titleLarge" style={{ marginVertical: 24 }}>
					Compared To
				</Text>

				<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
					<View style={{ width: "50%", padding: 8 }}>
						<TouchableOpacity onPress={() => setEnlargeImg(triplets.current[currTriplet][1])}>
							<Image
								source={swiped ? placeholderImage : { uri: triplets.current[currTriplet][1] }}
								resizeMode="cover"
								style={{ width: "100%", height: 200 }}
							/>
						</TouchableOpacity>
					</View>
					<View style={{ width: "50%", padding: 8 }}>
						{!swiped && triplets.current[currTriplet].length === 3 ? (
							<TouchableOpacity onPress={() => setEnlargeImg(triplets.current[currTriplet][2])}>
								<Image
									source={{ uri: triplets.current[currTriplet][2] }}
									resizeMode="cover"
									style={{ width: "100%", height: 200 }}
								/>
							</TouchableOpacity>
						) : (
							<Image
								source={placeholderImage}
								resizeMode="cover"
								style={{ width: "100%", height: 200 }}
							/>
						)}
					</View>
				</View>
			</View>

			{enlargeImg !== null &&
				<Portal>
					<Modal
						visible={true}
						dismissable={true}
						onDismiss={() => setEnlargeImg(null)}
					>
						<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
							<Image
								source={swiped ? placeholderImage : { uri: enlargeImg }}
								style={{ width: "100%", height: 500 }}
								resizeMode="contain"
							/>
						</View>
					</Modal>
				</Portal>
			}
		</GestureHandlerRootView>
	);
}
