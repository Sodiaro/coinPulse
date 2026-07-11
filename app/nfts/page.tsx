import { getNftCollections } from "@/lib/coingecko.actions";
import NftCard from "@/components/NftCard";

const Page = async () => {
	const collections = await getNftCollections();

	return (
		<main className="main-container">
			<div id="nfts-page">
				<div className="nfts-head">
					<h1>NFT Collections</h1>
					<p>Floor prices and 24h activity for notable collections.</p>
				</div>

				{collections.length > 0 ? (
					<div className="nfts-grid">
						{collections.map((collection, i) => (
							<NftCard
								key={collection.id}
								collection={collection}
								rank={i + 1}
							/>
						))}
					</div>
				) : (
					<p className="nfts-empty">
						Couldn&apos;t load NFT collections right now. Please try again
						later.
					</p>
				)}
			</div>
		</main>
	);
};

export default Page;
