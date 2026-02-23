"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";

interface PreviewTerminalProps {
  output: string;
}

export const PreviewTerminal = ({ output }: PreviewTerminalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const lastLengthRef = useRef<number>(0);

  // initialize terminal
  useEffect(() => {
    if (!containerRef.current || terminalRef.current) return;

    const terminal = new Terminal({
      convertEol: true,
      disableStdin: true,
      fontSize: 12,
      fontFamily: "monospace",
      theme: { background: "#1f2228" },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;

    // write existing output on mount
    if (output) {
      terminal.write(output);
      lastLengthRef.current = output.length;
    }

    requestAnimationFrame(() => fitAddon.fit());

    const resizeObserver = new ResizeObserver(() => fitAddon.fit());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  // handle output changes
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    if (output.length < lastLengthRef.current) {
      terminal.clear();
      lastLengthRef.current = 0;
    }

    const newData = output.slice(lastLengthRef.current);
    if (newData) {
      terminal.write(newData);
      lastLengthRef.current = output.length;
    }
  }, [output]);

  return (
    <div
      ref={containerRef}
      className="min-h-0 flex-1 bg-sidebar p-3 [&_.xterm]:h-full! [&_.xterm-screen]:h-full! [&_.xterm-viewport]:h-full!"
    />
  );
};
