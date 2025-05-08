import type { ImageRanking } from "@/types/album";
import type { RankingScores } from "@/types/ranking";

export default class Ranking {
	private INITIAL_SCORE = 50;
	private targetScoreChange = 3; // the amount to change the target images score by
	private compareScoreChange = 1; // the amount to change the compared images score by

	private scores: RankingScores = {};

	// round 1 image piles
	// this is used to generate the round 2 triplets
	private neutralImages: string[][] = [];

	private sortedScores: [string, number][] = [];

	constructor(images: string[]) {
		// setup the scores object
		for (const img of images) {
			this.scores[img] = this.INITIAL_SCORE;
		}
	}

	public updateScore(triplets: string[], rating: "like" | "dislike") {
		const targetImg = triplets[0];
		if (rating === "like") {
			this.scores[targetImg] += this.targetScoreChange;
		} else {
			this.scores[targetImg] -= this.targetScoreChange;
		}

		const comparedImgs = triplets.slice(1);
		for (const img of comparedImgs) {
			if (rating === "like") {
				this.scores[img] -= this.compareScoreChange;
			} else {
				this.scores[img] += this.compareScoreChange;
			}
		}
		this.neutralImages.push(comparedImgs);
	}

	public setRound2() {
		this.targetScoreChange = this.targetScoreChange / 2;
		this.compareScoreChange = this.compareScoreChange / 2;
	}

	public generateRound2Triplets(previousTriplets: string[][]): string[][] {
		const triplets: string[][] = [];

		for (const triplet of previousTriplets) {
			const targetImg = triplet[0];
			const comparedImgs = triplet.slice(1);

			let newCompareImgs: string[];
			const neutralOptions = this.neutralImages.filter(
				(imgs) => JSON.stringify(imgs) !== JSON.stringify(comparedImgs)
			);

			if (neutralOptions.length === 0) {
				// none left, meaning that the previous triplet took an option which left none for this final triplet.
				// as a result, swap the neutral images with the previous created triplet.

				const previousCreatedTriplet = triplets.pop();
				if (!previousCreatedTriplet) throw new Error("Failed to generate round 2 triplets");

				const adaptedPreviousTriplet = [previousCreatedTriplet[0], ...comparedImgs];
				triplets.push(adaptedPreviousTriplet);

				newCompareImgs = previousCreatedTriplet.slice(1);
			} else {
				const randomIndex = Math.floor(Math.random() * neutralOptions.length);
				newCompareImgs = neutralOptions[randomIndex];

				// remove from this.neutralImages
				this.neutralImages.splice(this.neutralImages.indexOf(newCompareImgs), 1);
			}

			triplets.push([targetImg, ...newCompareImgs]);
		}

		return triplets;
	}

	public categoriseImages(): ImageRanking[] {
		const sortedScores = Object.entries(this.scores).sort((img1, img2) => img1[1] - img2[1]);
		this.sortedScores = sortedScores;

		const categorisedScores = this.splitScoresArray(sortedScores);

		const imageRankings: ImageRanking[] = [];
		for (let i = 0; i < categorisedScores.length; i++) {
			const currCategory = categorisedScores[i];

			for (const img of currCategory) {
				const path = img[0];
				const starRanking = i + 1;
				imageRankings.push({ path, rank: starRanking });
			}
		}

		return imageRankings;
	}

	private splitScoresArray(scores: [string, number][]): [string, number][][] {
		const categorisedArray: [string, number][][] = [];

		const numElements = scores.length;
		const size = Math.floor(numElements / 3);
		let remainder = numElements % 3;

		let index = 0;
		for (let i = 0; i < 3; i++) {
			let currSize = size;
			if (remainder > 0) {
				currSize++;
				remainder--;
			}

			const endIndex = Math.min(index + currSize, numElements);
			const category = scores.slice(index, endIndex);
			categorisedArray.push(category);

			index = endIndex;
		}

		return categorisedArray;
	}

	public getTopScoreImage(): string {
		return this.sortedScores[this.sortedScores.length - 1][0];
	}
}
