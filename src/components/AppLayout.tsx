"use client";

import { ProtectedRoute } from "./ProtectedRoute";
import { Navbar } from "./Navbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<ProtectedRoute>
			<Navbar />
			<main className="page-transition">
				{children}
			</main>
		</ProtectedRoute>
	);
}
