export interface Ingredient {
  name: string;
  emoji: string;
}

// export interface Recipe {
//   id: string
//   name: string
//   ingredients: Ingredient[]
//   cookingTime: number
//   difficulty: string
//   steps: string[]
//   servingSuggestion: string
// }

// export type Recipe = {
//   name: string;
//   cookingTime: string;
//   difficulty: string;
//   ingredients: { name: string; emoji: string }[];
//   steps: string[];
//   servingSuggestion: string;
// };

export interface Recipe {
  name: string;
  taste: string;
  regionalContext: string;
  ingredients: { name: string; emoji: string }[];
  steps: string[];
  servingSuggestion: string;
  cookingTime: string;
  difficulty: string;
}
