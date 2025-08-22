export interface Cafe {
  name: string;
  lat: number;
  lng: number;
}

export const CAFE_LIST: Cafe[] = [
  { name: "Select a Café", lat: 0, lng: 0 }, // Placeholder, not for display
  { name: "Blue Tokai Coffee Roasters", lat: 28.5529, lng: 77.2691 }, // Greater Kailash
  { name: "Perch Wine & Coffee Bar", lat: 28.5541, lng: 77.2435 }, // Khan Market
  { name: "Third Wave Coffee", lat: 28.5273, lng: 77.2088 }, // Saket
  { name: "Starbucks", lat: 28.6304, lng: 77.2177 }, // Connaught Place
  { name: "Social", lat: 28.5298, lng: 77.2093 }, // Hauz Khas
  { name: "Keventers", lat: 28.5921, lng: 77.2198 }, // Select Citywalk
  { name: "Chaayos", lat: 28.4595, lng: 77.0266 }, // Galleria Market, Gurgaon
  { name: "The Grammar Room", lat: 28.5270, lng: 77.1592 }, // Mehrauli
  { name: "Diggin", lat: 28.5630, lng: 77.2378 }, // Anand Lok
  { name: "Another Fine Day", lat: 28.4575, lng: 77.0264 }, // Gurgaon
  { name: "Rose Cafe", lat: 28.5300, lng: 77.2600 }, // Saket
];
