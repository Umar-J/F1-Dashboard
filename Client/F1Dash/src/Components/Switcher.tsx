import React, { useState } from "react";

function Switcher11({ onToggle }: { onToggle: (state: boolean) => void }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    onToggle(isChecked);
  };

  return (
    <>
      <label className="themeSwitcherTwo shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-[#79797a] p-1">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span
          className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${
            !isChecked ? "text-primary bg-[#303032]" : "bg-[#79797a]"
          }`}
        >
          <img src="icons/driver-icon.svg" className="h-8 mr-1.5" />
          Drivers
        </span>
        <span
          className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${
            isChecked ? "text-primary bg-[#303032]" : "bg-[#79797a]"
          }`}
        >
          <img src="icons/constructor-icon.svg" className="h-8 mr-1.5" />
          Constructors
        </span>
      </label>
    </>
  );
}

export default Switcher11;
