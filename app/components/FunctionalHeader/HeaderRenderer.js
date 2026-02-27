"use client";

import HeaderLogic from "./ HeaderLogic";
import HeaderUI from "./HeaderUI";

export default function HeaderRenderer() {
  return (
    <HeaderLogic>
      {({ isOpen, handleClick }) => (
        <HeaderUI isOpen={isOpen} handleClick={handleClick} />
      )}
    </HeaderLogic>
  );
}
