import React from "react";
import { InputStep, Step } from "code-surfer-types";
import { parseSteps } from "@code-surfer/step-parser";
import { StylesProvider, CodeSurferTheme, Styled } from "@code-surfer/themes";
import { UnknownError } from "./errors";
import { CodeSurfer } from "./code-surfer";
import "./default-syntaxes";

type ParsedSteps = {
  steps: Step[];
  tokens: string[][];
  types: string[][];
  maxLineCount: number;
};

type CodeSurferProps = {
  steps?: InputStep[];
  parsedSteps?: ParsedSteps;
  progress: number;
  theme?: CodeSurferTheme;
  nonblocking?: boolean;
};

function InnerCodeSurfer({
  progress,
  steps: inputSteps,
  parsedSteps
}: CodeSurferProps) {
  const { steps, tokens, types, maxLineCount } = React.useMemo(() => {
    if (parsedSteps) return parsedSteps;
    return parseSteps(inputSteps!);
  }, [inputSteps, parsedSteps]);

  if (!steps || steps.length === 0) {
    throw new Error("No steps");
  }

  return (
    <CodeSurfer
      progress={progress}
      steps={steps}
      tokens={tokens}
      types={types}
      maxLineCount={maxLineCount!}
    />
  );
}

function CodeSurferWrapper({ theme, nonblocking, ...props }: CodeSurferProps) {
  const [wait, setWait] = React.useState(nonblocking);

  React.useEffect(() => {
    if (!wait) return;
    setWait(false);
  }, []);

  if (wait)
    return (
      <StylesProvider theme={theme}>
        <Styled.Placeholder />
      </StylesProvider>
    );

  return (
    <StylesProvider theme={theme}>
      <InnerCodeSurfer {...props} />
    </StylesProvider>
  );
}

export { CodeSurferWrapper as CodeSurfer, UnknownError };
