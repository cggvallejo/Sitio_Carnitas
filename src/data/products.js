import heroTacos from '../assets/images/hero_tacos.png';
import tacoMaciza from '../assets/images/taco_maciza.png';
import tacoSurtida from '../assets/images/taco_surtida.png';
import tacoCuero from '../assets/images/taco_cuero.png';
import tacoBuche from '../assets/images/taco_buche.png';
import tacoCachete from '../assets/images/taco_cachete.png';
import tacoTrompa from '../assets/images/taco_trompa.png';
import tacoOreja from '../assets/images/taco_oreja.png';
import tacoChamorro from '../assets/images/taco_chamorro.png';

import kiloMaciza from '../assets/images/kilo_maciza.png';
import gorditaImg from '../assets/images/gordita_carnitas.png';
import gorditaCuero from '../assets/images/gordita_cuero.png';

import tortaImg from '../assets/images/torta_carnitas.png';
import tortaCuero from '../assets/images/torta_cuero.png';
import tortaBuche from '../assets/images/torta_buche.png';
import tortaSurtida from '../assets/images/torta_surtida.png';
import tortaCachete from '../assets/images/torta_cachete.png';
import tortaTrompa from '../assets/images/torta_trompa.png';
import tortaOreja from '../assets/images/torta_oreja.png';
import tortaChamorro from '../assets/images/torta_chamorro.png';

import userCocaCola from '../assets/images/user_coca_cola.png';
import userHorchata from '../assets/images/user_horchata.png';
import userSalsaRoja from '../assets/images/user_salsa_roja.png';
import userSalsaVerde from '../assets/images/user_salsa_verde.png';
import salsaEspecial from '../assets/images/salsa_especial.png';

// Cortes base del Menú de Lona
const cortes = [
    { id: 'maciza', name: 'Maciza', desc: 'Pura carne magra, jugosa y suave.' },
    { id: 'cuero', name: 'Cuero', desc: 'Cuerito tierno y bien sazonado que se deshace.' },
    { id: 'buche', name: 'Buche', desc: 'Suave y delicioso estomago de cerdo confitado.', specialPrice: true },
    { id: 'surtido', name: 'Surtido', desc: 'Mezcla perfecta de maciza, cuerito y demás.' },
    { id: 'cachete', name: 'Cachete', desc: 'Carne extra suave, pura suavidad de la carita.' },
    { id: 'trompa', name: 'Trompa', desc: 'Con textura firme y un sabor intenso único.' },
    { id: 'oreja', name: 'Oreja', desc: 'Cartílago crujiente y sabroso, el favorito de conocedores.' },
    { id: 'chamorro', name: 'Chamorro', desc: 'La pierna jugosa y rica en sabor asombroso.' },
];

const generatedProducts = [];
let initialId = 100;

const tacoImagesMap = {
    maciza: tacoMaciza, cuero: tacoCuero, buche: tacoBuche, surtido: tacoSurtida,
    cachete: tacoCachete, trompa: tacoTrompa, oreja: tacoOreja, chamorro: tacoChamorro
};

const tortaImagesMap = {
    maciza: tortaImg, cuero: tortaCuero, buche: tortaBuche, surtido: tortaSurtida,
    cachete: tortaCachete, trompa: tortaTrompa, oreja: tortaOreja, chamorro: tortaChamorro
};

const gorditaImagesMap = {
    cuero: gorditaCuero
};

// Generar combinaciones de platillos por cada corte
cortes.forEach(corte => {
    // Taco
    generatedProducts.push({
        id: initialId++,
        name: `Taco de ${corte.name}`,
        description: `Taco individual de ${corte.desc}`,
        price: corte.id === 'buche' ? 35.00 : 30.00,
        image: tacoImagesMap[corte.id] || heroTacos,
        category: 'Tacos'
    });

    // Torta
    generatedProducts.push({
        id: initialId++,
        name: `Torta de ${corte.name}`,
        description: `Bolillo crujiente relleno de ${corte.name}, frijoles y más.`,
        price: corte.id === 'buche' ? 60.00 : 50.00,
        image: tortaImagesMap[corte.id] || tortaImg,
        category: 'Tortas'
    });

    // Gordita
    generatedProducts.push({
        id: initialId++,
        name: `Gordita de ${corte.name}`,
        description: `Masa frita abierta y rellena de ${corte.name} con guarnición.`,
        price: corte.id === 'buche' ? 60.00 : 50.00,
        image: gorditaImagesMap[corte.id] || gorditaImg,
        category: 'Gorditas'
    });

    // Kilo (Mantenemos general o por categoría)
    if (corte.id === 'maciza') {
        generatedProducts.push({
            id: initialId++,
            name: `1 Kilo de Carnitas`,
            description: `Un kilo de nuestras mejores carnitas listo para compartir.`,
            price: 400.00,
            image: kiloMaciza,
            category: 'Por Kilo'
        });
    }
});

// Quesadillas específicas de la lona ($45 / $50)
const rellenosQuesadillas = [
    { name: 'Papas con Longaniza', price: 45 },
    { name: 'Longaniza', price: 45 },
    { name: 'Picadillo', price: 45 },
    { name: 'Champiñones', price: 45 },
    { name: 'Queso', price: 45 },
    { name: 'Tinga de Pollo', price: 45 },
    { name: 'Chicharrón Prensado', price: 45 },
    { name: 'Carne Asada', price: 50 },
    { name: 'Carnitas', price: 50 },
];

rellenosQuesadillas.forEach(q => {
    generatedProducts.push({
        id: initialId++,
        name: `Quesadilla de ${q.name}`,
        description: `Deliciosa quesadilla al comal rellena de ${q.name}.`,
        price: q.price,
        image: gorditaImg,
        category: 'Quesadillas'
    });
});

export const products = [
    ...generatedProducts,
    // ── Tacos Adicionales ──────────────────────────────────────────
    { id: 400, name: 'Taco de Carne Asada', description: 'Taco de carne asada estilo tradicional.', price: 30.00, image: heroTacos, category: 'Tacos' },
    { id: 401, name: 'Taco de Longaniza', description: 'Taco de longaniza bien doradita.', price: 30.00, image: heroTacos, category: 'Tacos' },
    { id: 402, name: 'Taco Campechano', description: 'El clásico mix de asada y longaniza.', price: 30.00, image: heroTacos, category: 'Tacos' },

    // ── Bebidas (Unificadas a $35 según lona) ──────────────────────
    { id: 200, name: 'Aguas de Sabor (1/2 lt)', description: 'Agua fresca del día (Horchata, Jamaica, etc.).', price: 35.00, image: userHorchata, category: 'Bebidas' },
    { id: 201, name: 'Refrescos (1/2 lt)',      description: 'Variedad de refrescos bien fríos.', price: 35.00, image: userCocaCola, category: 'Bebidas' },
    { id: 202, name: 'Agua Natural (1 lt)',     description: 'Agua natural 1 litro.', price: 35.00, image: userSalsaVerde, category: 'Bebidas' },
    { id: 203, name: 'Agua Mineral',            description: 'Agua mineral gasificada.', price: 35.00, image: salsaEspecial, category: 'Bebidas' },

    // ── Complementos ─────────────────────────────────────────────────
    {
        id: 6,
        name: 'Salsa Roja Especial (250ml)',
        description: 'Auténtica salsa de chile de árbol asado y limón.',
        price: 35.00,
        image: userSalsaRoja,
        category: 'Complementos'
    },
    {
        id: 300,
        name: 'Salsa Verde Clásica (250ml)',
        description: 'Salsa verde de tomatillo fresco y un toque de habanero.',
        price: 35.00,
        image: userSalsaVerde,
        category: 'Complementos'
    }
];
