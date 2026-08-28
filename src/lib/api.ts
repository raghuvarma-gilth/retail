const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Analytics
export async function getAnalyticsOverview() {
  return fetchFromAPI('/analytics/overview');
}

// Inventory
export async function getRestockSummary() {
  return fetchFromAPI('/inventory/restock');
}

// Forecast
export async function getDemandForecast(features: any) {
  return fetchFromAPI('/forecast/predict', {
    method: 'POST',
    body: JSON.stringify({ features }),
  });
}

// AI - Gemini
export async function getUpcomingFestivals() {
  return fetchFromAPI('/ai/festivals');
}

export async function getRealtimeGreeting() {
  return fetchFromAPI('/ai/greeting');
}

export async function askGemini(prompt: string) {
  return fetchFromAPI('/ai/ask', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}

export async function explainRestock(context: {
  product_name: string;
  current_stock: number;
  predicted_demand: number;
  average_daily_sales: number;
}) {
  return fetchFromAPI('/ai/explain/restock', {
    method: 'POST',
    body: JSON.stringify(context),
  });
}

export async function explainMarketing(context: {
  product_name: string;
  discount_percentage: number;
}) {
  return fetchFromAPI('/ai/explain/marketing', {
    method: 'POST',
    body: JSON.stringify(context),
  });
}

export async function explainAnalytics(data: any) {
  return fetchFromAPI('/ai/explain/analytics', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

// AI - Hugging Face Search
export async function searchProducts(query: string, topN: number = 5) {
  return fetchFromAPI(`/ai/search?q=${encodeURIComponent(query)}&top_n=${topN}`);
}

export async function getSimilarProducts(productName: string, topN: number = 5) {
  return fetchFromAPI(`/ai/similar-product?product=${encodeURIComponent(productName)}&top_n=${topN}`);
}

// Basket - FP-Growth
export async function getBasketRecommendations(product: string, topN: number = 5) {
  return fetchFromAPI(`/basket/recommendations?product=${encodeURIComponent(product)}&top_n=${topN}`);
}

// System Status
export async function getSystemStatus() {
  return fetchFromAPI('/system/status');
}

// Pricing
export async function getPricingAnalysis() {
  return fetchFromAPI('/pricing/');
}

// Weather
export async function getWeatherAnalysis() {
  return fetchFromAPI('/weather/analysis');
}

// Seasonality
export async function getSeasonalityAnalysis() {
  return fetchFromAPI('/seasonality/');
}

// Anomaly
export async function getAnomalyDetection() {
  return fetchFromAPI('/anomaly/');
}

// Recommendations
export async function getBusinessRecommendations() {
  return fetchFromAPI('/recommendations/');
}

// Promotion
export async function getPromotionAnalysis() {
  return fetchFromAPI('/promotion/');
}
