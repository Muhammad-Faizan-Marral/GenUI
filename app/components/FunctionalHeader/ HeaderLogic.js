"use client";

import { useState } from "react";

export default function HeaderLogic({ children }) {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const handleClick = (e) => {
    toggleMenu()
    console.log(isOpen)

    const target = e.target.dataset?.target;
    const action = e.target.dataset?.action;
  

    if (action === "scroll" && target) {
      const el = document.querySelector(target);

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
        });
      }
      setIsOpen(false);
    }

    if (action === "toggle-menu") {
      toggleMenu();
    }
    
  };

  return children({
    isOpen,
    handleClick,
  });
}
