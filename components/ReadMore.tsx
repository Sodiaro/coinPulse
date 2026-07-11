"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ReadMore = ({
	text,
	clampAt = 300,
}: {
	text: string;
	clampAt?: number;
}) => {
	const [expanded, setExpanded] = useState(false);
	const canToggle = text.length > clampAt;
	const clamped = canToggle && !expanded;

	return (
		<div className="read-more">
			<div className={cn("about-text-wrap", clamped && "is-clamped")}>
				<p className="about-text">{text}</p>
				{clamped && <span className="about-fade" />}
			</div>

			{canToggle && (
				<button
					type="button"
					className="read-more-btn"
					onClick={() => setExpanded((v) => !v)}
				>
					{expanded ? "Show less" : "Read more"}
					<ChevronDown
						size={14}
						className={cn("chevron", expanded && "is-open")}
					/>
				</button>
			)}
		</div>
	);
};

export default ReadMore;
