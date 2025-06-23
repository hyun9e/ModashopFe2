"use client";
import React from "react";

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.alert("Tính năng sẽ sớm ra mắt!");
  };
  return (
    <a href={href} onClick={handleClick} className="text-sm leading-6 text-black hover:text-gray-700">
      {children}
    </a>
  );
};

export default FooterLink;
