"use client";

import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	deleteDoc,
	doc,
	updateDoc,
	Timestamp,
	QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import { Transaction, Debt } from "@/types";

/**
 * Get the user's transactions collection reference
 */
function getTransactionsRef(userId: string) {
	return collection(db, "users", userId, "transactions");
}

/**
 * Get the user's debts collection reference
 */
function getDebtsRef(userId: string) {
	return collection(db, "users", userId, "debts");
}

/**
 * Save a transaction to Firestore
 */
export async function saveTransaction(userId: string, transaction: Partial<Transaction>) {
	try {
		const ref = getTransactionsRef(userId);
		const data = {
			...transaction,
			date: transaction.date instanceof Date ? Timestamp.fromDate(transaction.date) : transaction.date,
			createdAt: Timestamp.now(),
		};
		const docRef = await addDoc(ref, data);
		return docRef.id;
	} catch (error) {
		console.error("Error saving transaction:", error);
		throw error;
	}
}

/**
 * Save multiple transactions to Firestore
 */
export async function saveTransactions(userId: string, transactions: Partial<Transaction>[]) {
	try {
		const ref = getTransactionsRef(userId);
		const promises = transactions.map((t) => {
			const data = {
				...t,
				date: t.date instanceof Date ? Timestamp.fromDate(t.date) : t.date,
				createdAt: Timestamp.now(),
			};
			return addDoc(ref, data);
		});
		const results = await Promise.all(promises);
		return results.map((r) => r.id);
	} catch (error) {
		console.error("Error saving transactions:", error);
		throw error;
	}
}

/**
 * Get all transactions for a user
 */
export async function getTransactions(userId: string): Promise<(Partial<Transaction> & { id: string })[]> {
	try {
		const ref = getTransactionsRef(userId);
		const q = query(ref);
		const snapshot = await getDocs(q);
		const transactions: (Partial<Transaction> & { id: string })[] = [];

		snapshot.forEach((doc) => {
			const data = doc.data();
			transactions.push({
				...data,
				id: doc.id,
				date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
			} as Partial<Transaction> & { id: string });
		});

		return transactions.sort((a, b) => {
			const dateA = a.date instanceof Date ? a.date.getTime() : 0;
			const dateB = b.date instanceof Date ? b.date.getTime() : 0;
			return dateB - dateA;
		});
	} catch (error) {
		console.error("Error fetching transactions:", error);
		return [];
	}
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(userId: string, transactionId: string) {
	try {
		const ref = doc(db, "users", userId, "transactions", transactionId);
		await deleteDoc(ref);
	} catch (error) {
		console.error("Error deleting transaction:", error);
		throw error;
	}
}

/**
 * Update a transaction
 */
export async function updateTransaction(userId: string, transactionId: string, updates: Partial<Transaction>) {
	try {
		const ref = doc(db, "users", userId, "transactions", transactionId);
		const data = {
			...updates,
			date: updates.date instanceof Date ? Timestamp.fromDate(updates.date) : updates.date,
			updatedAt: Timestamp.now(),
		};
		await updateDoc(ref, data);
	} catch (error) {
		console.error("Error updating transaction:", error);
		throw error;
	}
}

/**
 * Save a debt to Firestore
 */
export async function saveDebt(userId: string, debt: Partial<Debt>) {
	try {
		const ref = getDebtsRef(userId);
		const data = {
			...debt,
			createdAt: Timestamp.now(),
		};
		const docRef = await addDoc(ref, data);
		return docRef.id;
	} catch (error) {
		console.error("Error saving debt:", error);
		throw error;
	}
}

/**
 * Get all debts for a user
 */
export async function getDebts(userId: string): Promise<(Partial<Debt> & { id: string })[]> {
	try {
		const ref = getDebtsRef(userId);
		const q = query(ref);
		const snapshot = await getDocs(q);
		const debts: (Partial<Debt> & { id: string })[] = [];

		snapshot.forEach((doc) => {
			debts.push({
				...doc.data(),
				id: doc.id,
			} as Partial<Debt> & { id: string });
		});

		return debts;
	} catch (error) {
		console.error("Error fetching debts:", error);
		return [];
	}
}

/**
 * Delete a debt
 */
export async function deleteDebt(userId: string, debtId: string) {
	try {
		const ref = doc(db, "users", userId, "debts", debtId);
		await deleteDoc(ref);
	} catch (error) {
		console.error("Error deleting debt:", error);
		throw error;
	}
}

/**
 * Update a debt
 */
export async function updateDebt(userId: string, debtId: string, updates: Partial<Debt>) {
	try {
		const ref = doc(db, "users", userId, "debts", debtId);
		await updateDoc(ref, {
			...updates,
			updatedAt: Timestamp.now(),
		});
	} catch (error) {
		console.error("Error updating debt:", error);
		throw error;
	}
}
