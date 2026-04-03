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

// Define the base locations data
export const locationsData = [
    {
        id: 'matrix',
        name: 'Sucursal Cancún Matrix',
        address: 'Av. Las Torres SM 50, Cancún, Q.R.',
        phone: '998 123 4567',
        hours: 'Lun - Dom: 8:00 AM - 4:00 PM',
        lat: 21.1619,
        lng: -86.8515,
        mapUrl: 'https://maps.google.com/?q=21.1619,-86.8515',
        iframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14886.649363165215!2d-86.8515!3d21.1619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA5JzQyLjkiTiA4Nl81MScwNS40Ilc!5e0!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx'
    },
    {
        id: 'puerto',
        name: 'Sucursal Puerto Morelos',
        address: 'Calle Rafael Melgar, Puerto Morelos, Q.R.',
        phone: '998 765 4321',
        hours: 'Mar - Dom: 8:00 AM - 3:00 PM',
        lat: 20.8475,
        lng: -86.8756,
        mapUrl: 'https://maps.google.com/?q=20.8475,-86.8756',
        iframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14886.649363165215!2d-86.8756!3d20.8475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDUwJzUxLjAiTiA4Ns_NTInMzIuMSJX!5e0!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx'
    }
];

// Returns the closest branch object from an optional locations array
export const getClosestBranch = (userLat, userLng, locations = locationsData) => {
    if (!locations || locations.length === 0) return null;

    let closest = locations[0];
    let minDistance = calculateDistance(userLat, userLng, closest.lat, closest.lng);

    for (let i = 1; i < locations.length; i++) {
        const branch = locations[i];
        const dist = calculateDistance(userLat, userLng, branch.lat, branch.lng);
        if (dist < minDistance) {
            minDistance = dist;
            closest = branch;
        }
    }
    return closest;
};
