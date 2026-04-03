import React from 'react';
import Hero from './Hero';
import About from './About';
import ProductGrid from './ProductGrid';
import Locations from './Locations';
import Reviews from './Reviews';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <Hero />
      
      <section id="quienes-somos">
        <About />
      </section>

      <section id="menu">
        <ProductGrid />
      </section>

      <section id="ubicaciones">
        <Locations />
      </section>

      <section id="resenas">
        <Reviews />
      </section>
    </motion.main>
  );
};

export default Home;
