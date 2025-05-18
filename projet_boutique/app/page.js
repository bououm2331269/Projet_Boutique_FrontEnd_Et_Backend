import Image from "next/image";
import styles from "./page.module.css";
import Carousel from "./components/carousel";
import ProductCards from "./components/productList";
import Inscription from "./components/inscription";
import HeaderDepart from "./components/headerDepart";

export default function Home() {
  return (
    <>
     <HeaderDepart/>
     <Inscription/>
    </>
  );
}
