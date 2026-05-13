import { useEffect } from "react";

export function useClickSound() {
  useEffect(() => {
    const down = new Audio("/mouse_down.mp3");
    const up = new Audio("/mouse_up.mp3");
    down.volume = 0.3;
    up.volume = 0.3;

    const handleDown = () => { down.currentTime = 0; down.play().catch(() => {}); };
    const handleUp   = () => { up.currentTime = 0;   up.play().catch(() => {}); };

    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup",   handleUp);
    return () => {
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup",   handleUp);
    };
  }, []);
}
