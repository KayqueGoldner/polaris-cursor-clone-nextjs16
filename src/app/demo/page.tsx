"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

interface DemoPageProps {}

const DemoPage = ({}: DemoPageProps) => {
  const [response, setResponse] = useState<string>("No response yet");
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  const handleBlocking = async () => {
    try {
      setIsLoading(true);
      setResponse("Loading response...");
      const response = await fetch("/api/demo/blocking", { method: "POST" });
      const data = await response.json();
      setResponse(data.response._output);
    } catch (error) {
      console.error(error);
      setResponse("Error loading response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackground = async () => {
    try {
      setIsLoading(true);
      setResponse("Background job started");
      await fetch("/api/demo/background", { method: "POST" });
    } catch (error) {
      console.error(error);
      setResponse("Error starting background job");
    } finally {
      setIsLoading(false);
      setResponse("Background job started");
    }
  };

  // client error - throws an error on the client
  const handleClientError = () => {
    Sentry.logger.info("User attempted to trigger client error", { userId });
    throw new Error("Client error: something went wrong");
  };

  // server error - throws an error on the server
  const handleApiError = async () => {
    await fetch("/api/demo/error", { method: "POST" });
  };

  // inngest error - throws an error on the background job
  const handleInngestError = async () => {
    await fetch("/api/demo/inngest-error", { method: "POST" });
  };

  return (
    <div className="space-x-4 p-8">
      <div className="flex gap-4">
        <Button onClick={handleBlocking} disabled={isLoading}>
          {isLoading ? "Loading..." : "Blocking"}
        </Button>
        <Button onClick={handleBackground} disabled={isLoading}>
          {isLoading ? "Loading..." : "Background"}
        </Button>
        <Button variant="destructive" onClick={handleClientError}>
          Client Error
        </Button>
        <Button variant="destructive" onClick={handleApiError}>
          Server Error
        </Button>
        <Button variant="destructive" onClick={handleInngestError}>
          Inngest Error
        </Button>
      </div>
      <p>response: {response}</p>
    </div>
  );
};

export default DemoPage;
