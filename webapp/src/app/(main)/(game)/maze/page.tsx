"use client";

import { useForm, Controller, set } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ColorPicker from "@/components/ColorPicker";
import { useRef, useState } from "react";
import apiClient from "@/lib/axios";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  FileCodeIcon,
  RotateCcw,
  MenuIcon,
  TriangleAlert,
} from "lucide-react"; // Icons for download options
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Dropdown component
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MazeExplanation from "./maze-explanation";
import { Separator } from "@/components/ui/separator";
import Preview from "./Preview";
import { useMaskData } from "./hooks/useMaskData";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateCredits } from "@/lib/utils";
import { FontSelector } from "@/components/font-selector";
import { useToast } from "@/hooks/use-toast";

const FONT_SIZES = Array.from({ length: 31 }, (_, i) => i + 10);
const CELL_NUMBERS = Array.from({ length: 51 }, (_, i) => i + 10);
const CELL_WIDTHS = Array.from({ length: 21 }, (_, i) => i + 10);
const LINE_WIDTHS = Array.from({ length: 6 }, (_, i) => i + 1);
const LAYERS = Array.from({ length: 19 }, (_, i) => i + 2);
const ALGORITHMS = [
  "recursiveBacktrack",
  "binaryTree",
  "sidewinder",
  "aldousBroder",
  "wilson",
  "huntAndKill",
  "kruskal",
  "simplifiedPrims",
  "truePrims",
  // "ellers",
];

interface IndicatorConfig {
  showIndicator: boolean;
  size: number;
  start: {
    color: string;
    shape: string;
  };
  end: {
    color: string;
    shape: string;
  };
}

// Form data structure
interface MazeFormData {
  heading: string;
  fontFamily: string;
  fontSize: string;
  headingColor: string;
  columnCount: string; // New field
  rowCount: string; // New field
  cellWidth: string;
  shape: string;
  mazeColor: string;
  mazeBackgroundColor: string;
  exitConfig: string;
  difficulty: string;
  solutionColor: string;
  lineWidth: string;
  layers: string;
  indicator?: IndicatorConfig;
}

export default function MazePage() {
  const { control, register, handleSubmit, watch } = useForm<MazeFormData>({
    defaultValues: {
      heading: "Maze Puzzle",
      fontFamily: "Arial",
      fontSize: "20",
      headingColor: "#000000",
      columnCount: "20",
      rowCount: "20",
      cellWidth: "20",
      shape: "Square",
      mazeColor: "#000000",
      mazeBackgroundColor: "#FFFFFF",
      exitConfig: "vertical",
      difficulty: "recursiveBacktrack",
      solutionColor: "#ff0000",
      lineWidth: "1",
      layers: "5",
      indicator: {
        showIndicator: false,
        size: 0.65,
        start: {
          color: "#28b463",
          shape: "square",
        },
        end: {
          color: "#c0392b",
          shape: "square",
        },
      },
    },
  });
  const randomSeedRef = useRef<number>(Date.now());
  const [showSolution, setShowSolution] = useState(false);
  const [mazeImage, setMazeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Loading effect for download
  const [isOpenWarning, setIsOpenWarning] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Watch the shape field to conditionally show the layers field
  const formData = watch();

  const {
    maskData,
    clear: clearMaskData,
    set: setMaskData,
  } = useMaskData(
    formData.shape.toLowerCase(),
    formData.shape === "Circle"
      ? formData.layers
      : `${formData.columnCount}-${formData.rowCount}`
  );

  // Form submission for generating the maze
  const onSubmit = async (data: MazeFormData) => {
    setIsLoading(true); // Start loading
    try {
      randomSeedRef.current = Date.now(); // Update random seed
      const requestBody = {
        rowCount: data.rowCount ? parseInt(data.rowCount) : undefined,
        columnCount: data.columnCount ? parseInt(data.columnCount) : undefined,
        cellWidth: data.cellWidth ? parseInt(data.cellWidth) : undefined,
        cellShape: data.shape?.toLowerCase() || undefined,
        openColor: data.mazeBackgroundColor || undefined,
        closedColor: data.mazeColor || undefined,
        pathColor: data.solutionColor || undefined,
        exitConfig: data.exitConfig || undefined,
        lineWidth: data.lineWidth ? parseFloat(data.lineWidth) : undefined,
        layers: data.shape === "Circle" ? parseInt(data.layers) : undefined,
        solve: showSolution,
        randomSeed: randomSeedRef.current,
        algorithm: data.difficulty,
        mask: maskData,
        indicator: data.indicator?.showIndicator
          ? {
              ...data.indicator,
              padding: 1 - data.indicator.size,
            }
          : undefined,
      };

      const filteredRequestBody = Object.fromEntries(
        Object.entries(requestBody).filter(([_, value]) => value !== undefined)
      );

      const response = await apiClient.post(
        "api/maze/generate",
        filteredRequestBody,
        { responseType: "blob" }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setMazeImage(imageUrl);
    } catch (error: any) {
      if (error.isAxiosError) {
        if (error.response?.status === 400 || error.response?.status === 500) {
          // Show warning dialog for invalid request
          setIsOpenWarning(true);
          return;
        }
      }

      console.error("Error generating maze:", error);
      alert("Failed to generate maze. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle download functionality
  const handleDownload = async (format: string, size?: string) => {
    setIsDownloading(true); // Start loading for download
    const data = watch(); // Get current form values
    const requestBody = {
      rowCount: data.rowCount ? parseInt(data.rowCount) : undefined,
      columnCount: data.columnCount ? parseInt(data.columnCount) : undefined,
      cellWidth: data.cellWidth ? parseInt(data.cellWidth) : undefined,
      cellShape: data.shape?.toLowerCase() || undefined,
      openColor: data.mazeBackgroundColor || undefined,
      closedColor: data.mazeColor || undefined,
      pathColor: data.solutionColor || undefined,
      exitConfig: data.exitConfig || undefined,
      lineWidth: data.lineWidth ? parseFloat(data.lineWidth) : undefined,
      layers: data.shape === "Circle" ? parseInt(data.layers) : undefined,
      solve: showSolution || format === "pdf", // Always show solution for PDF
      format,
      pdf: size
        ? {
            size,
            heading: [data.heading, `${data.heading} Solution`],
            fontSize: data.fontSize,
            fontColor: data.headingColor,
            fontFamily: data.fontFamily,
          }
        : undefined,
      randomSeed: randomSeedRef.current,
      mask: maskData,
      algorithm: data.difficulty,
      indicator: data.indicator?.showIndicator
        ? {
            ...data.indicator,
            padding: 1 - data.indicator.size,
          }
        : undefined,
    };

    const filteredRequestBody = Object.fromEntries(
      Object.entries(requestBody).filter(([_, value]) => value !== undefined)
    );

    try {
      const response = await apiClient.post(
        "api/maze/download",
        filteredRequestBody,
        { responseType: "blob" }
      );
      console.log(response.headers);

      const availableQuota = response.headers["x-available-quota"] || 0;
      const isScaled = response.headers["x-is-scaled"] === "true";
      updateCredits(availableQuota);

      // Create a blob URL and trigger download
      const blobUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `maze-${new Date().toISOString()}.${format}`;
      link.click();
      URL.revokeObjectURL(blobUrl); // Clean up

      if (isScaled) {
        toast({
          description: (
            <span className="flex gap-2">
              <TriangleAlert className="text-yellow-500" />
              Maze scaled to fit. Adjust columns or cell size for a better fit.
            </span>
          ),
        });
      }
    } catch (error: any) {
      if (error.isAxiosError) {
        if (error.response?.status === 400 || error.response?.status === 500) {
          // Show warning dialog for invalid request
          setIsOpenWarning(true);
          return;
        }
      }

      console.error("Error downloading maze:", error);
      alert("Failed to download maze. Please try again.");
    } finally {
      setIsDownloading(false); // Stop loading for download
    }
  };

  return (
    <section className="container mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Maze Generator</h1>
      <p>
        Create unlimited random and unique printable maze puzzles with solutions
        in various shapes, formats, sizes, and designs using this online tool.
        Download your maze patterns in PDF, PNG, or SVG formats. Simply enter
        your maze design preferences and click the "Generate Maze" button to get
        started.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-6 overflow-x-auto"
      >
        {/* Controls Panel */}
        <div className="w-full md:w-1/3 border p-4 rounded-lg space-y-3 sm:min-w-80">
          {/* Heading Section */}
          <div className="border-b pb-5 space-y-4">
            <h2 className="font-bold">
              Heading{" "}
              <span className="font-normal text-muted-foreground text-sm">
                (For PDF file only)
              </span>
            </h2>
            <Input {...register("heading")} />

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Font Family</Label>
                <Controller
                  control={control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FontSelector
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              </div>

              <div>
                <Label>Font Size</Label>
                <Controller
                  control={control}
                  name="fontSize"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Font Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.map((size) => (
                          <SelectItem key={size} value={`${size}`}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label>Font Color</Label>
                <Controller
                  control={control}
                  name="headingColor"
                  render={({ field }) => (
                    <ColorPicker
                      color={field.value}
                      onChange={(color) => field.onChange(color)}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Two-Column Configuration */}
          <div className="grid grid-cols-2 gap-4">
            {/* Shape */}
            <div>
              <Label>Shape</Label>
              <Controller
                control={control}
                name="shape"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Square">Square</SelectItem>
                      <SelectItem value="Triangle">Triangle</SelectItem>
                      <SelectItem value="Hexagon">Hexagon</SelectItem>
                      <SelectItem value="Circle">Circle</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Cell Width */}
            <div>
              <Label>Cell Width</Label>
              <Controller
                control={control}
                name="cellWidth"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Width" />
                    </SelectTrigger>
                    <SelectContent>
                      {CELL_WIDTHS.map((width) => (
                        <SelectItem key={width} value={`${width}`}>
                          {width}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Column Count */}
            {formData.shape !== "Circle" && (
              <div>
                <Label>Column Count</Label>
                <Controller
                  control={control}
                  name="columnCount"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Columns" />
                      </SelectTrigger>
                      <SelectContent>
                        {CELL_NUMBERS.map((num) => (
                          <SelectItem key={num} value={`${num}`}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Number of Layers (Conditional) */}
            {formData.shape === "Circle" && (
              <div>
                <Label>Number of Layers</Label>
                <Controller
                  control={control}
                  name="layers"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Layers" />
                      </SelectTrigger>
                      <SelectContent>
                        {LAYERS.map((layer) => (
                          <SelectItem key={layer} value={`${layer}`}>
                            {layer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Row Count */}
            {formData.shape !== "Circle" && (
              <div>
                <Label>Row Count</Label>
                <Controller
                  control={control}
                  name="rowCount"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Rows" />
                      </SelectTrigger>
                      <SelectContent>
                        {CELL_NUMBERS.map((num) => (
                          <SelectItem key={num} value={`${num}`}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Maze Color */}
            <div>
              <Label>Maze Color</Label>
              <Controller
                control={control}
                name="mazeColor"
                render={({ field }) => (
                  <ColorPicker
                    color={field.value}
                    onChange={(color) => field.onChange(color)}
                  />
                )}
              />
            </div>

            {/* Maze Background Color */}
            <div>
              <Label>Background Color</Label>
              <Controller
                control={control}
                name="mazeBackgroundColor"
                render={({ field }) => (
                  <ColorPicker
                    color={field.value}
                    onChange={(color) => field.onChange(color)}
                  />
                )}
              />
            </div>

            {/* Solution Color */}
            <div>
              <Label>Solution Color</Label>
              <Controller
                control={control}
                name="solutionColor"
                render={({ field }) => (
                  <ColorPicker
                    color={field.value}
                    onChange={(color) => field.onChange(color)}
                  />
                )}
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <Label>Build Strategy</Label>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALGORITHMS.map((algo, index) => (
                        <SelectItem key={algo} value={algo}>
                          Strategy {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Exit Config */}
            <div>
              <Label>Exit Direction</Label>
              <Controller
                control={control}
                name="exitConfig"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Exit Config" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="hardest">Hardest</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Line Width */}
            <div>
              <Label>Line Width</Label>
              <Controller
                control={control}
                name="lineWidth"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Line Width" />
                    </SelectTrigger>
                    <SelectContent>
                      {LINE_WIDTHS.map((width) => (
                        <SelectItem key={width} value={`${width}`}>
                          {width}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Add the Indicator Fields */}
          <div className="space-y-4 border p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Controller
                name="indicator.showIndicator"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox
                    id="show-indicator"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
              <Label htmlFor="show-indicator">Show Indicator</Label>
            </div>

            {watch("indicator.showIndicator") && (
              <>
                <div>
                  <Label>Size</Label>
                  <Controller
                    name="indicator.size"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        min="0.1"
                        max="0.9"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    )}
                  />
                </div>

                <div>
                  <Label>Start Indicator</Label>
                  <div className="flex space-x-2">
                    <Controller
                      name="indicator.start.shape"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Shape" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="hexagon">Hexagon</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="indicator.start.color"
                      control={control}
                      render={({ field }) => (
                        <ColorPicker
                          color={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label>End Indicator</Label>
                  <div className="flex space-x-2">
                    <Controller
                      name="indicator.end.shape"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Shape" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="hexagon">Hexagon</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Controller
                      name="indicator.end.color"
                      control={control}
                      render={({ field }) => (
                        <ColorPicker
                          color={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 border p-4 rounded-lg flex flex-col items-center space-y-6">
          <div className="w-full flex justify-between items-center">
            {/* Left: Generate Button and Show Solution Checkbox */}
            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" disabled={isLoading}>
                    <MenuIcon />{" "}
                    {/* Add an appropriate icon for the dropdown */}
                    {isLoading ? "Generating..." : "Controls"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                      onClick={() => {
                        handleSubmit(onSubmit)();
                      }}
                    >
                      {isLoading ? "Generating..." : "Generate Maze"}
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setMazeImage(null);
                      }}
                    >
                      <RotateCcw />
                      Reset Maze
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        clearMaskData();
                        setMazeImage(null);
                      }}
                    >
                      <RotateCcw />
                      Reset Maze + Masks
                    </Button>
                  </DropdownMenuItem>
                  <Separator className="my-2" />
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-solution"
                        checked={showSolution}
                        onCheckedChange={(checked) =>
                          setShowSolution(!!checked)
                        }
                      />
                      <Label htmlFor="show-solution">Show solution</Label>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Maze"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline">
                      <RotateCcw />
                      Reset
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setMazeImage(null)}>
                      Reset Maze
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        clearMaskData();
                        setMazeImage(null);
                      }}
                    >
                      Reset Maze + Masks
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-solution"
                    checked={showSolution}
                    onCheckedChange={(checked) => setShowSolution(!!checked)}
                  />
                  <Label htmlFor="show-solution">Show solution</Label>
                </div>
              </div>
            )}

            {/* Right: Download Button (only shown if mazeImage exists) */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isDownloading || !mazeImage}
                      >
                        <DownloadIcon />
                        {isDownloading ? "Downloading..." : "Download"}
                      </Button>
                    </div>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                {(isDownloading || !mazeImage) && (
                  <TooltipContent>
                    <p>Generate maze to enable download</p>
                  </TooltipContent>
                )}
              </Tooltip>
              {!(isDownloading || !mazeImage) && (
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleDownload("pdf", "letter")}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        <span>PDF (Letter Size)</span>
                      </div>
                      <span className="text-muted-foreground text-sm pl-6">
                        Includes puzzle and solution
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("pdf", "A4")}>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        <span>PDF (A4)</span>
                      </div>
                      <span className="text-muted-foreground text-sm pl-6">
                        Includes puzzle and solution
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("png")}>
                    <div className="flex items-center">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      <span>PNG</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("svg")}>
                    <div className="flex items-center">
                      <FileCodeIcon className="mr-2 h-4 w-4" />
                      <span>SVG</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>

          {/* Maze Image or Placeholder */}
          {mazeImage ? (
            <img
              src={mazeImage}
              alt="Generated Maze"
              className="max-w-full h-auto"
            />
          ) : (
            <Preview
              formData={formData}
              setMaskData={setMaskData}
              maskData={maskData}
            />
          )}
        </div>
      </form>

      <Separator className="!mt-10" />
      <MazeExplanation />

      <AlertDialog open={isOpenWarning} onOpenChange={setIsOpenWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Can't generate your maze</AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                Your maze configuration is invalid. Please check your settings
                and try again.
              </p>
              <br />
              <p>Here are some common issues:</p>
              <ul className="list-disc pl-4">
                <li>You can't remove the center cell of circle shape.</li>
                <li>
                  Sometimes it may not work out, but just try again, and
                  everything will be fine.
                </li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got It</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
