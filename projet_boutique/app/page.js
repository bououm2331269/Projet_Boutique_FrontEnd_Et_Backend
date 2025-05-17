import Image from "next/image";
import styles from "./page.module.css";
import Carousel from "./components/carousel";
import ProductCards from "./components/productList";

export default function Home() {
  return (
    <>
      <h1></h1>
      <Carousel />
      <ProductCards />
    </>
  );
}
