import Image from "next/image";
import MazeMask from "./MazeMask";

export default function Preview(props: any) {
  return (
    <div>
      <MazeMask {...props} />
      <div className="mt-4 text-muted-foreground text-sm">
        - Click <strong>Generate Maze</strong> button to make maze puzzles.
        <br />- Click on the maze cells above to customize the maze by removing
        them. (Gray cells indicate removed cells.)
      </div>
    </div>
  );
}
