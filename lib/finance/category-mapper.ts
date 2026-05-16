import type { TransactionType } from "@/lib/types/finance";

// Must match exactly what's in categories[] in finance.ts
const EXPENSE_RULES: { pattern: RegExp; category: string }[] = [
  {
    pattern:
      /swiggy|zomato|food|restaurant|cafe|bakery|hotel|eat|pizza|burger|domino/i,
    category: "Food & Dining",
  },
  {
    pattern:
      /uber|ola|rapido|metro|bus|cab|fuel|petrol|diesel|fastag|toll|railway|railways|uts|train|cumta/i,
    category: "Transportation",
  },
  {
    pattern:
      /amazon(?!.*pay later)|flipkart|myntra|meesho|ajio|nykaa|mall|mart|store|shopping/i,
    category: "Shopping",
  },
  {
    pattern: /netflix|spotify|hotstar|prime|youtube|movie|cinema|pvr|inox/i,
    category: "Entertainment",
  },
  {
    pattern:
      /tangedco|electricity|power|bsnl|jio|airtel|sun direct|recharge|broadband|wifi|internet|bill|utility|postpaid|prepaid|water|gas/i,
    category: "Bills & Utilities",
  },
  {
    pattern: /hospital|clinic|pharmacy|medicine|doctor|health|apollo|medplus/i,
    category: "Healthcare",
  },
  {
    pattern: /school|college|university|course|udemy|coursera|fee|tuition/i,
    category: "Education",
  },
  {
    pattern: /irctc|makemytrip|goibibo|airbnb|flight|hotel|travel/i,
    category: "Travel",
  },
  {
    pattern: /salon|spa|grooming|haircut|beauty|personal care/i,
    category: "Personal Care",
  },
];

const INCOME_RULES: { pattern: RegExp; category: string }[] = [
  { pattern: /salary|payroll|stipend|wages/i, category: "Salary" },
  { pattern: /freelance|invoice|client|project/i, category: "Freelance" },
  {
    pattern: /dividend|interest|mutual|stock|investment|returns/i,
    category: "Investments",
  },
  { pattern: /gift|reward|cashback|bonus/i, category: "Gifts" },
];

export function mapCategory(
  type: TransactionType,
  counterParty: string,
  details: string,
): string {
  const haystack = `${counterParty} ${details}`;

  if (type === "income") {
    for (const { pattern, category } of INCOME_RULES) {
      if (pattern.test(haystack)) return category;
    }
    return "Other Income";
  }

  for (const { pattern, category } of EXPENSE_RULES) {
    if (pattern.test(haystack)) return category;
  }
  return "Other";
}
