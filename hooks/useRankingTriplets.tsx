import TripletGenerationModule from "@/modules/triplet-generation";
import { updateAlbumRanked, updateImageRankings } from "@/utils/db";
import Ranking from "@/utils/Ranking";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";

export default function useRankingTriplets(albumId: number, images: string[], method: string) {
	const db = useSQLiteContext();
	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(true);
	const [swiped, setSwiped] = useState<boolean>(false);
	const [currTriplet, setCurrTriplet] = useState<number>(0);

	const triplets = useRef<string[][]>([]);
	const round = useRef<0 | 1 | 2>(0);
	const ranking = useRef<Ranking | null>(null);
	const rating = useRef<null | "like" | "dislike">(null);

	const getInitialTriplets = async () => {
		let generatedTriplets: string[][] = [];

		if (method === "similarity") {
			generatedTriplets = await TripletGenerationModule.similarity(images);
		} else {
			generatedTriplets = await TripletGenerationModule.metadata(images);
		}

		ranking.current = new Ranking(images);
		round.current = 1;
		triplets.current = generatedTriplets;

		setCurrTriplet(0);
		setLoading(false);
	};

	const getRound2Triplets = async () => {
		if (!ranking.current)
			throw new Error("The ranking instance is null, cannot generate round 2 triplets");

		ranking.current.setRound2();
		const newTriplets = await ranking.current.generateRound2Triplets(triplets.current);
		triplets.current = newTriplets;

		round.current = 2;
		setCurrTriplet(0);
		setLoading(false);
	};

	const updateAlbumRankings = async () => {
		if (!ranking.current)
			throw new Error("The ranking instance is null, cannot update album rankings");

		const rankedImages = ranking.current.categoriseImages();
		await updateImageRankings(db, albumId, rankedImages);

		const thumbnailImage = ranking.current.getTopScoreImage();
		await updateAlbumRanked(db, albumId, thumbnailImage);

		setTimeout(() => {
			router.replace(`/view/${albumId}`);
		}, 1000);
	};

	useEffect(() => {
		if (currTriplet > triplets.current.length - 1 && round.current === 1) {
			setLoading(true);
			getRound2Triplets();
		}

		if (currTriplet > triplets.current.length - 1 && round.current === 2) {
			setLoading(true);
			updateAlbumRankings();
		}

		setSwiped(false);
	}, [currTriplet]);

	useEffect(() => {
		if (swiped) {
			if (rating.current === null) throw new Error("You need to update the rating useRef");

			ranking.current?.updateScore(triplets.current[currTriplet], rating.current);
			rating.current = null;
			setCurrTriplet(currTriplet + 1);
		}
	}, [swiped]);

	useEffect(() => {
		getInitialTriplets();
	}, []);

	return {
		loading,
		triplets,
		round,
		currTriplet,
		swiped,
		setSwiped,
		rating
	};
}
