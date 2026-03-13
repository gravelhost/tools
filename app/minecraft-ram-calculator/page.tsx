"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bean, Flame, Info, Package, PawPrint, Pickaxe, Zap } from "lucide-react";

const RAM_MIN = 1;
const RAM_MAX = 128;

const TIERS = {
  budget: { label: "Budget", pricePerGb: 0.9 },
  premium: { label: "Premium", pricePerGb: 1.5 },
  ultimate: { label: "Ultimate", pricePerGb: 3 },
} as const;
type Tier = keyof typeof TIERS;

type Game = "vanilla" | "paper" | "modpacks";

const GAME_DEFAULT_RAM: Record<Game, number> = {
  vanilla: 8,
  paper: 12,
  modpacks: 16,
};

export default function RamCalculator() {
  const [ram, setRam] = useState([8]);
  const [tier, setTier] = useState<Tier>("budget");
  const [game, setGame] = useState<Game>("vanilla");

  const selectGame = (g: Game) => {
    setGame(g);
    setRam([GAME_DEFAULT_RAM[g]]);
  };

  const ramGb = ram[0];
  const pricePerGb = TIERS[tier].pricePerGb;
  const price = ramGb * pricePerGb;

  const bestForLabel =
    ramGb >= 32
      ? "You already know it ;)"
      : ramGb >= 16
        ? `${ramGb * 4} Players`
        : `${ramGb * 2} Players`;

  const buttonBase =
    "w-full text-base sm:text-xl h-10 sm:h-12 rounded-lg cursor-pointer transition-colors ";
  const buttonInactive =
    "bg-[#36446B] hover:bg-[#36446B]/80 border-none ring-0";
  const buttonActive =
    "bg-[#235AB4] hover:bg-[#235AB4]/90 border-none ring-0";

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-2 md:py-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="lg"
          className={`${buttonBase} ${tier === "budget" ? buttonActive : buttonInactive}`}
          onClick={() => setTier("budget")}
        >
          <Package className="size-5 sm:size-6" />
          {TIERS.budget.label}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className={`${buttonBase} ${tier === "premium" ? buttonActive : buttonInactive}`}
          onClick={() => setTier("premium")}
        >
          <Flame className="size-5 sm:size-6" />
          {TIERS.premium.label}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className={`${buttonBase} ${tier === "ultimate" ? buttonActive : buttonInactive}`}
          onClick={() => setTier("ultimate")}
        >
          <Zap className="size-5 sm:size-6" />
          {TIERS.ultimate.label}
        </Button>
      </div>
      <Card className="bg-[#0E1222] rounded-2xl sm:rounded-3xl bg-radial-[at_30%_75%] from-[#10294E] to-[#0E1222] calculator-card">
        <CardContent className="py-4 px-4 sm:px-6 md:px-12">
          <div className="grid gap-6 md:gap-12 md:grid-cols-2">
            <div className="space-y-3 sm:space-y-4">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#DBE9FE]">
                    <p className="text-[#2B7FFF]">Gravel Host</p>
                    <p>Ram Calculator</p>
                </CardTitle>
                <CardDescription className="text-[#A4BDDE] text-base md:text-lg">
                  Choose how much memory you need. The calculator will estimate the price based on the amount of RAM you choose.
                </CardDescription>
              </CardHeader>
              <div className="space-y-1 text-[#DBE9FE]">
                <p className="text-sm text-[#94A0B6]">Estimated price</p>
                <p className="text-3xl sm:text-4xl font-semibold">
                  <span className="text-[#949FB2]">$</span>{price.toLocaleString()}
                  <span className="text-sm font-normal text-[#94A0B6]">
                    /mo
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-start">
              <div className="flex items-center gap-2">
                <p className="text-lg sm:text-xl md:text-2xl text-[#8095B2]">Best for: <span className="text-[#2B7FFF]">{bestForLabel}</span></p>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 sm:pt-3">
                <span className="text-[#EFF6FF] text-2xl sm:text-3xl font-bold">RAM</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full pt-2">
                <span className="text-sm sm:text-lg text-[#8092AF] shrink-0">{RAM_MIN} GB</span>
                <Slider
                  value={ram}
                  onValueChange={setRam}
                  min={RAM_MIN}
                  max={RAM_MAX}
                  step={1}
                  thumbLabel={`${ramGb} GB`}
                  className="flex-1 min-w-0"
                  trackClassName="bg-[#222F45] data-[orientation=horizontal]:h-[16px]"
                  rangeClassName="bg-[#235AB4]"
                />
                <span className="text-sm sm:text-lg text-[#8092AF] shrink-0">{RAM_MAX} GB</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-3 sm:pt-4">
                <span className="text-[#EFF6FF] text-2xl sm:text-3xl font-bold">Or, Let us choose</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full pt-2">
                <Button
                  className={`w-full text-white border-none ring-0 cursor-pointer text-base sm:text-lg h-10 transition-colors ${game === "vanilla" ? "bg-[#1D58B4] hover:bg-[#1D58B4]/90" : "bg-[#36446B] hover:bg-[#36446B]/80"}`}
                  onClick={() => selectGame("vanilla")}
                >
                  <Pickaxe className="size-4 sm:size-5" />
                  Vanilla
                </Button>
                <Button
                  className={`w-full text-white border-none ring-0 cursor-pointer text-base sm:text-lg h-10 transition-colors ${game === "paper" ? "bg-[#1D58B4] hover:bg-[#1D58B4]/90" : "bg-[#36446B] hover:bg-[#36446B]/80"}`}
                  onClick={() => selectGame("paper")}
                >
                  <PawPrint className="size-4 sm:size-5" />
                  Paper/Purpur
                </Button>
                <Button
                  className={`w-full text-white border-none ring-0 cursor-pointer text-base sm:text-lg h-10 transition-colors ${game === "modpacks" ? "bg-[#1D58B4] hover:bg-[#1D58B4]/90" : "bg-[#36446B] hover:bg-[#36446B]/80"}`}
                  onClick={() => selectGame("modpacks")}
                >
                  <Bean className="size-4 sm:size-5" />
                  Modpacks
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Alert className="calculator-info-bar rounded-lg border-[#222F45] bg-[#0E1222] text-[#A4BDDE] [&>svg]:text-[#2B7FFF] px-3 py-3 sm:px-4 sm:py-3">
        <Info className="size-4 sm:size-5 shrink-0" />
        <AlertDescription className="text-[#A4BDDE] text-sm sm:text-base">
          Ram consumption might vary based on your server setup and mods/plugins. Please use this calculator as a guide only.
        </AlertDescription>
      </Alert>
    </div>
  );
}
