"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  ExternalLink,
  Info,
  Loader2,
  Search,
} from "lucide-react";
import { SkinViewer } from "skinview3d";

export default function SkinGrabber() {
  const [searchValue, setSearchValue] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [noAccountFound, setNoAccountFound] = useState(false);
  const [skinUrl, setSkinUrl] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);

  const initViewer = useCallback(
    (skinSrc: string, nameTag?: string) => {
      if (!canvasRef.current) return;

      viewerRef.current?.dispose();

      const isMobile = window.innerWidth < 640;
      const width = isMobile ? 220 : 300;
      const height = isMobile ? 300 : 400;

      const viewer = new SkinViewer({
        canvas: canvasRef.current,
        height,
        width,
        skin: skinSrc,
      });
      viewer.autoRotate = false;
      viewer.fov = 10;
      viewer.zoom = 0.7;
      viewer.controls.enableZoom = false;
      if (nameTag) viewer.nameTag = nameTag;

      viewerRef.current = viewer;
    },
    [],
  );

  const updateSkin = useCallback(
    async (username: string) => {
      if (!username) return;
      if (username.length > 16) return;
      if (!/^[a-zA-Z0-9_]+$/.test(username)) return;
      if (username === currentSearch) return;

      setLoading(true);
      setNoAccountFound(false);
      setCurrentSearch(username);

      try {
        const skinPath = `/api/skin/${encodeURIComponent(username)}`;
        const res = await fetch(skinPath);

        if (!res.ok) {
          setNoAccountFound(true);
          setLoading(false);
          return;
        }

        setSkinUrl(skinPath);
        setLoading(false);

        // Small delay so the canvas is rendered before initializing the viewer
        setTimeout(() => {
          initViewer(skinPath, username);
        }, 10);
      } catch {
        setNoAccountFound(true);
        setLoading(false);
      }
    },
    [currentSearch, initViewer],
  );

  // Load default skin on mount + handle URL hash param
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const ign = params.get("ign");

    if (ign) {
      setSearchValue(ign);
      updateSkin(ign);
    } else {
      setSearchValue("Notch");
      updateSkin("Notch");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") updateSkin(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " ") e.preventDefault();
  };

  const buttonBase =
    "cursor-pointer transition-colors border-none ring-0 text-white";
  const buttonStyle = "bg-[#235AB4] hover:bg-[#235AB4]/90";

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-2 md:py-2 space-y-4 bg-transparent">
      <Card className="bg-[#0E1222] rounded-2xl sm:rounded-3xl bg-radial-[at_30%_75%] from-[#10294E] to-[#0E1222]">
        <CardContent className="py-6 px-4 sm:px-6 md:px-12">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#DBE9FE]">
              <p className="text-[#2B7FFF]">Gravel Host</p>
              <p>Skin Grabber</p>
            </CardTitle>
            <CardDescription className="text-[#A4BDDE] text-base md:text-lg">
              Search for a Minecraft player to view and download their skin.
            </CardDescription>
          </CardHeader>

          {/* Search bar */}
          <div className="flex gap-2 sm:gap-3">
            <input
              className="flex-1 min-w-0 rounded-lg bg-[#141517] text-[#DBE9FE] placeholder-[#8092AF] px-3 sm:px-4 py-2 text-base border border-[#222F45] outline-none focus:border-[#235AB4] transition-colors"
              maxLength={16}
              type="text"
              placeholder="Enter username..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyPress}
            />
            <Button
              className={`${buttonBase} ${buttonStyle} px-3 sm:px-6`}
              onClick={() => updateSkin(searchValue)}
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>

          {/* Skin viewer area */}
          <div className="flex flex-col items-center mt-6 min-h-[320px] sm:min-h-[420px]">
            {loading ? (
              <div className="flex items-center justify-center h-[300px] sm:h-[400px]">
                <Loader2 className="size-10 animate-spin text-[#2B7FFF]" />
              </div>
            ) : noAccountFound ? (
              <p className="mt-10 text-[#F55050] text-xl sm:text-2xl text-center">
                No account with this username has been found.
              </p>
            ) : (
              <>
                <canvas ref={canvasRef} className="rounded-lg" />
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
                  <a href={skinUrl} download>
                    <Button
                      className={`${buttonBase} ${buttonStyle}`}
                    >
                      <Download className="size-4" />
                      Download Skin
                    </Button>
                  </a>
                  <a
                    href="https://www.minecraft.net/en-us/msaprofile/mygames/editskin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className={`${buttonBase} bg-[#36446B] hover:bg-[#36446B]/80`}
                    >
                      <ExternalLink className="size-4" />
                      Apply Skin
                    </Button>
                  </a>
                </div>
              </>
            )}
          </div>

        </CardContent>
      </Card>

      <Alert className="rounded-lg border-[#222F45] bg-[#0E1222] text-[#A4BDDE] [&>svg]:text-[#2B7FFF] px-3 py-3 sm:px-4 sm:py-3">
        <Info className="size-4 sm:size-5 shrink-0" />
        <AlertDescription className="text-[#A4BDDE] text-sm sm:text-base">
          Skins are fetched from Mojang&apos;s servers. Some skins may not be
          available if the account has migration restrictions.
        </AlertDescription>
      </Alert>
    </div>
  );
}
