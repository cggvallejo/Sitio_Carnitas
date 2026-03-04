import heroTacos from '../assets/images/hero_tacos.png';
import kiloMaciza from '../assets/images/kilo_maciza.png';
import tacoMaciza from '../assets/images/taco_maciza.png';
import tacoSurtida from '../assets/images/taco_surtida.png';
import bebidasImg from '../assets/images/bebidas.png';

export const products = [
    {
        id: 1,
        name: 'Tacos de Carnitas (Orden x3)',
        description: 'Tres deliciosos tacos con maciza, surtida o costilla, servidos con cebolla y cilantro.',
        price: 95.00,
        image: heroTacos,
        category: 'Platillos'
    },
    {
        id: 7,
        name: 'Taco de Maciza',
        description: 'Taco individual de pura maciza de cerdo, suave y jugosa.',
        price: 35.00,
        image: tacoMaciza,
        category: 'Por Taco'
    },
    {
        id: 8,
        name: 'Taco de Surtida',
        description: 'Taco individual con la mezcla perfecta de maciza, cuerito y costilla.',
        price: 32.00,
        image: tacoSurtida,
        category: 'Por Taco'
    },
    {
        id: 9,
        name: 'Taco de Cuerito',
        description: 'Taco individual de cuerito tierno y bien sazonado.',
        price: 30.00,
        image: tacoSurtida,
        category: 'Por Taco'
    },
    {
        id: 2,
        name: '1kg de Maciza',
        description: 'Un kilo de carnitas maciza premium, jugosa y doradita. Incluye salsas y tortillas.',
        price: 450.00,
        image: kiloMaciza,
        category: 'Por Kilo'
    },
    {
        id: 3,
        name: '1kg de Surtida',
        description: 'Mezcla perfecta de cuerito, maciza y costilla. El sabor tradicional completo.',
        price: 420.00,
        image: kiloMaciza,
        category: 'Por Kilo'
    },
    {
        id: 4,
        name: 'Torta de Carnitas',
        description: 'Bolillo crujiente relleno de carnitas, frijoles refritos, aguacate y jalapeños.',
        price: 85.00,
        image: heroTacos,
        category: 'Platillos'
    },
    {
        id: 10,
        name: 'Refresco Botella 600ml',
        description: 'Coca-Cola, Sprite, Sidral Mundet. Elige tu favorito.',
        price: 25.00,
        image: bebidasImg,
        category: 'Bebidas'
    },
    {
        id: 11,
        name: 'Agua de Sabor (Medio Litro)',
        description: 'Horchata o Jamaica natural, recién hecha.',
        price: 30.00,
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=400',
        category: 'Bebidas'
    },
    {
        id: 5,
        name: 'Refresco Familiar 2L',
        description: 'Coca-Cola de 2 litros bien fría.',
        price: 45.00,
        image: bebidasImg,
        category: 'Bebidas'
    },
    {
        id: 6,
        name: 'Salsa Especial (250ml)',
        description: 'Nuestra famosa salsa verde de habanero y aguacate.',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1599307767316-776533bb941c?auto=format&fit=crop&q=80&w=400',
        category: 'Complementos'
    }
];
