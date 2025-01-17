import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "./ui/select";
  
  export function FontSelector({
    onChange,
    value,
  }: {
    onChange: (val: any) => void;
    value: any;
  }) {
    return (
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder="Font Family" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Chlakh">Chlakh</SelectItem>
          <SelectItem value="Courier New">Courier New</SelectItem>
          <SelectItem value="EBGaramond">EBGaramond</SelectItem>
          <SelectItem value="Free Sans">Free Sans</SelectItem>
          <SelectItem value="Free Serif">Free Serif</SelectItem>
          <SelectItem value="Grad">Grad</SelectItem>
          <SelectItem value="Helvetica">Helvetica</SelectItem>
          <SelectItem value="Jenson">Jenson</SelectItem>
          <SelectItem value="Open Sans">Open Sans</SelectItem>
          <SelectItem value="Palatino">Palatino</SelectItem>
          <SelectItem value="Play Time">Play Time</SelectItem>
          <SelectItem value="Roboto">Roboto</SelectItem>
          <SelectItem value="Roboto Slab">Roboto Slab</SelectItem>
          <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
          <SelectItem value="Times Roman">Times Roman</SelectItem>
        </SelectContent>
      </Select>
    );
  }