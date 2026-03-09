export const locationsData = [
    {
        id: 1,
        name: "Sucursal Centro",
        address: "Av. Tulum 123, Centro, 77500 Cancún, Q.R.",
        phone: "998 123 4567",
        hours: "Lunes a Domingo: 8:00 AM - 10:00 PM",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        lat: 21.1619,
        lng: -86.8252
    },
    {
        id: 2,
        name: "Sucursal Zona Hotelera",
        address: "Blvd. Kukulcan Km 9, Zona Hotelera, 77500 Cancún, Q.R.",
        phone: "998 987 6543",
        hours: "Lunes a Domingo: 9:00 AM - 11:00 PM",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        lat: 21.1347,
        lng: -86.7466
    }
];

// Calculate Haversine distance in kilometers
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Returns the closest branch object from locationsData
export const getClosestBranch = (userLat, userLng) => {
    if (!locationsData || locationsData.length === 0) return null;

    let closest = locationsData[0];
    let minDistance = calculateDistance(userLat, userLng, closest.lat, closest.lng);

    for (let i = 1; i < locationsData.length; i++) {
        const branch = locationsData[i];
        const dist = calculateDistance(userLat, userLng, branch.lat, branch.lng);
        if (dist < minDistance) {
            minDistance = dist;
            closest = branch;
        }
    }
    return closest;
};
