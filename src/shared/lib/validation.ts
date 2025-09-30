import type { GearCategory } from '@/shared/types';

export interface ValidationResult {
	isValid: boolean;
	nameValid: boolean;
	weightValid: boolean;
	categoryValid: boolean;
}

export interface GearItemInput {
	name: string;
	category: GearCategory;
	weight: number | null;
}

export function validateGearItem(input: GearItemInput): ValidationResult {
	const nameValid = input.name.trim().length > 0;
	const weightValid = input.weight !== null && input.weight > 0;
	const categoryValid = true; // Category is always valid from dropdown

	return {
		isValid: nameValid && weightValid && categoryValid,
		nameValid,
		weightValid,
		categoryValid
	};
}

export function validateItemName(name: string): boolean {
	return name.trim().length > 0 && name.trim().length <= 100;
}

export function validateItemWeight(weight: number | null): boolean {
	return weight !== null && weight > 0 && weight <= 100000; // max 100kg
}