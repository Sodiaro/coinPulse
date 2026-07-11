const Loading = () => {
	return (
		<main className="main-container">
			<div id="nfts-page">
				<div className="nfts-head">
					<h1>NFT Collections</h1>
					<p>Floor prices and 24h activity for notable collections.</p>
				</div>

				<div className="nfts-grid">
					{Array.from({ length: 12 }, (_, i) => (
						<div className="nft-card-skeleton" key={i}>
							<div className="skel-banner skeleton">
								<div className="skel-avatar skeleton" />
							</div>
							<div className="skel-body">
								<div className="line-1 skeleton" />
								<div className="line-2 skeleton" />
								<div className="line-3 skeleton" />
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
};

export default Loading;
