import React from 'react';
import styles from './Nav.module.css';
import { FaArrowLeftLong } from "react-icons/fa6";

function Nav({ cambiarPagina }) {
  return (
    <div className={styles.bodyNav}>
      {/* Al hacer clic en este artículo, se ejecuta cambiarPagina("menu") */}
      <article onClick={() => cambiarPagina("menu")} className={styles.back}>
        <FaArrowLeftLong size={20} />
      </article>
      <article></article>
      <article></article>
    </div>
  );
}

export default Nav;
