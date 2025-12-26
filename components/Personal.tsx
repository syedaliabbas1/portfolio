import Link from "next/link";
import React from "react";
import { personalInfo } from "@/data/portfolio-data";

export default function Personal() {
  return (
    <div className="flex space-x-24">
      <Link href="/" className="text-xl text-[#999] pt-2 mb-2 ml-2">
        {personalInfo.name}
      </Link>
      <h2 className="text-xl text-[#999] pt-2 mb-2 ml-2 hidden lg:flex">
        {personalInfo.title}
      </h2>
    </div>
  );
}
