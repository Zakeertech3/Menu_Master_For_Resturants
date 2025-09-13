export interface UserPreferences {
  likes: string;
  dislikes: string;
  spiceLevel: 'mild' | 'medium' | 'spicy' | 'very_spicy';
  diningScenario?: string;
}

export const diningScenarios = [
  { id: 'none', label: "Just Exploring", icon: 'QuestionIcon' },
  { id: 'price_conscious', label: "Price-conscious", icon: 'PriceIcon' },
  { id: 'healthy', label: "Healthy Options", icon: 'LeafIcon' },
  { id: 'sharing', label: "Sharing with Friends", icon: 'UsersIcon' },
  { id: 'quick_lunch', label: "Quick Lunch Break", icon: 'ClockIcon' },
] as const;


export interface Dish {
  dishName: string;
  explanation: string;
  keyIngredients: string[];
  tasteProfile: string;
  allergenAlerts?: string[];
}

export interface Recommendation {
  dishName: string;
  reason: string;
}

export interface DietaryAlert {
  dishName: string;
  reason: string;
}

export interface AnalysisResult {
  menuScanResults: {
    cuisineType: string;
    restaurantStyle: string;
    language: string;
  };
  dishDecoder: Dish[];
  smartRecommendations: Recommendation[];
  dietaryAlerts: DietaryAlert[];
  culturalInsights: {
    title: string;
    content: string;
  };
  orderingStrategy: {
    title: string;
    content: string;
  };
}