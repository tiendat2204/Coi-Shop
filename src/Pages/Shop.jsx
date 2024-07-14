import React from "react";
import Hero from "../Components/Hero/Hero";
import Popular from "../Components/Popular/Popular";
import Stats from "../Components/Offer/Stats";
import NewCollections from "../Components/NewCollections/NewCollections";
import NewsLetter from "../Components/NewsLetter/NewsLetter";
import Paralax from "../Components/NewParalax/Paralax";

const Shop = () => {
  return (
    <div>
      <Hero />
      <Popular />
      <Stats/>
      <NewCollections/>
      <Paralax/>
    <NewsLetter/>
    </div>
  );
};

export default Shop;
