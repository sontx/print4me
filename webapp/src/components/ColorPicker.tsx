"use client";

import { useCallback, useState } from "react";
import { SketchPicker } from "react-color";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const handleChange = useCallback(
    (updatedColor: any) => {
      onChange(updatedColor.hex);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="w-9 min-w-9 h-9 rounded-md cursor-pointer border"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <SketchPicker color={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  );
}
