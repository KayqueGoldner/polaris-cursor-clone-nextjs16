import { useCallback, useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";

import { useFiles } from "@/features/projects/hooks/use-files";

import { buildFileTree, getFilePath } from "../utils/file-tree";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// singleton instance of webcontainer
let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

const getWebContainer = async (): Promise<WebContainer> => {
  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  if (!bootPromise) {
    bootPromise = WebContainer.boot({
      coep: "credentialless",
    });
  }

  webcontainerInstance = await bootPromise;

  return webcontainerInstance;
};

const teardownWebContainer = () => {
  if (webcontainerInstance) {
    webcontainerInstance.teardown();
    webcontainerInstance = null;
  }

  bootPromise = null;
};

interface UseWebContainerProps {
  projectId: Id<"projects">;
  enabled: boolean;
  settings?: {
    installCommand?: string;
    devCommand?: string;
  };
}

export const useWebContainer = ({
  projectId,
  enabled,
  settings,
}: UseWebContainerProps) => {
  const [status, setStatus] = useState<
    "idle" | "booting" | "installing" | "running" | "error"
  >("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restartKey, setRestartKey] = useState<number>(0);
  const [terminalOutput, setTerminalOutput] = useState<string>("");

  const containerRef = useRef<WebContainer | null>(null);
  const hasStartedRef = useRef<boolean>(false);

  // fetch files from convex (auto-updates on changes)
  const files = useFiles(projectId);

  // initial boot and mount
  useEffect(() => {
    if (!enabled || !files || files.length === 0 || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const start = async () => {
      try {
        setStatus("booting");
        setError(null);
        setTerminalOutput("");

        const appendOutput = (output: string) => {
          setTerminalOutput((prev) => prev + output);
        };

        const webcontainer = await getWebContainer();
        containerRef.current = webcontainer;

        const fileTree = buildFileTree(files);
        await webcontainer.mount(fileTree);

        webcontainer.on("server-ready", (_port, url) => {
          setPreviewUrl(url);
          setStatus("running");
        });

        setStatus("installing");

        // parse install command (default: "npm install")
        const installCommand = settings?.installCommand || "npm install";
        const [installBin, ...installArgs] = installCommand.split(" ");
        appendOutput(`$ ${installCommand}\n`);
        const installProcess = await webcontainer.spawn(
          installBin,
          installArgs,
        );
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              appendOutput(data);
            },
          }),
        );
        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error(
            `${installCommand} failed with code ${installExitCode}`,
          );
        }

        // parse dev command (default: "npm run dev")
        const devCommand = settings?.devCommand || "npm run dev";
        const [devBin, ...devArgs] = devCommand.split(" ");
        appendOutput(`\n$ ${devCommand}\n`);
        const devProcess = await webcontainer.spawn(devBin, devArgs);
        devProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              appendOutput(data);
            },
          }),
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
        setStatus("error");
      }
    };

    start();
  }, [
    enabled,
    files,
    restartKey,
    settings?.devCommand,
    settings?.installCommand,
  ]);

  // sync file changes (hot-reload)
  useEffect(() => {
    const webcontainer = containerRef.current;
    if (!webcontainer || !files || status !== "running") {
      return;
    }

    const filesMap = new Map(files.map((file) => [file._id, file]));

    for (const file of files) {
      if (file.type !== "file" || file.storageId || !file.content) continue;

      const filePath = getFilePath(file, filesMap);
      webcontainer.fs.writeFile(filePath, file.content);
    }
  }, [files, status]);

  // reset when disabled
  useEffect(() => {
    if (!enabled) {
      hasStartedRef.current = false;
      setStatus("idle");
      setPreviewUrl(null);
      setError(null);
    }
  }, [enabled]);

  // restart the entire webcontainer process
  const restart = useCallback(() => {
    teardownWebContainer();
    containerRef.current = null;
    hasStartedRef.current = false;
    setStatus("idle");
    setPreviewUrl(null);
    setError(null);
    setRestartKey((prev) => prev + 1);
  }, []);

  return {
    status,
    previewUrl,
    error,
    terminalOutput,
    restart,
  };
};
