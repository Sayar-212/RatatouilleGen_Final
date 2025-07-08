import type { Recipe } from "./types"

const foodEmojis = [
  "🍅",
  "🧄",
  "🌿",
  "🧀",
  "🍄",
  "🥦",
  "🥕",
  "🍆",
  "🌶️",
  "🧅",
  "🥬",
  "🍋",
  "🍊",
  "🥩",
  "🍗",
  "🍤",
  "🥚",
  "🥛",
  "🧈",
  "🍚",
  "🍝",
  "🌮",
  "🥔",
  "🥒",
]

const getRandomEmoji = () => {
  return foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
}

const generatePoeticalName = (ingredients: string[]) => {
  const adjectives = [
    "Whispering",
    "Dreamy",
    "Velvet",
    "Midnight",
    "Golden",
    "Rustic",
    "Simmering",
    "Aromatic",
    "Celestial",
    "Silken",
  ]

  const nouns = [
    "Symphony",
    "Sonata",
    "Rhapsody",
    "Serenade",
    "Melody",
    "Harmony",
    "Ballad",
    "Cascade",
    "Embrace",
    "Whisper",
  ]

  const mainIngredient = ingredients[Math.floor(Math.random() * ingredients.length)]
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]

  return `${adjective} ${mainIngredient} ${noun}`
}

const generateSteps = (ingredients: string[]) => {
  const steps = [
    `Prepare all ${ingredients.join(", ")} by washing and chopping them into bite-sized pieces.`,
    `In a large pan, heat olive oil over medium heat and add aromatics.`,
    `Add ${ingredients[0]} and ${ingredients[1]} to the pan and sauté until softened.`,
    `Season with salt, pepper, and your choice of herbs.`,
    `Cover and simmer for 15-20 minutes, stirring occasionally.`,
    `Add ${ingredients[ingredients.length - 1]} during the last 5 minutes of cooking.`,
    `Taste and adjust seasoning as needed before serving.`,
  ]

  return steps
}

const generateServingSuggestion = (dishName: string) => {
  const suggestions = [
    `Serve ${dishName} on a warmed plate with a sprinkle of fresh herbs.`,
    `Present ${dishName} in a shallow bowl with a drizzle of high-quality olive oil.`,
    `Garnish ${dishName} with edible flowers and serve with crusty artisan bread.`,
    `Plate ${dishName} with a side of seasonal greens and a light vinaigrette.`,
    `Serve ${dishName} family-style in a rustic ceramic dish at the center of the table.`,
  ]

  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

export const generateRecipe = (ingredientsInput: string): Recipe => {
  const ingredientsList = ingredientsInput
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

  const recipeIngredients = ingredientsList.map((name) => ({
    name,
    emoji: getRandomEmoji(),
  }))

  const dishName = generatePoeticalName(ingredientsList)
  const steps = generateSteps(ingredientsList)
  const servingSuggestion = generateServingSuggestion(dishName)

  return {
    id: Math.random().toString(36).substring(2, 9),
    name: dishName,
    ingredients: recipeIngredients,
    cookingTime: Math.floor(Math.random() * 30) + 20,
    difficulty: ["Easy", "Medium", "Challenging"][Math.floor(Math.random() * 3)],
    steps,
    servingSuggestion,
  }
}
