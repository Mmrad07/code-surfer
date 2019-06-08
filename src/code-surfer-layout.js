import React from "react";
import { useDeck } from "mdx-deck";
import CodeSurfer from "./code-surfer";
import { parseMetastring } from "./codeblock-metastring-parser";

function CodeSurferLayout({ children, ...props }) {
  const deck = useDeck();
  const steps = React.useMemo(getStepsFromChildren(children), [deck.index]);
  const lang = steps.length && steps[0].lang;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <CodeSurfer steps={steps} lang={lang} />
    </div>
  );
}

const getStepsFromChildren = children => () => {
  const cs = React.Children.toArray(children);
  return cs
    .map(c => {
      if (!c.props.children || !c.props.children.props) {
        return null;
      }
      const { props } = c.props.children;
      const classNames = props.className;
      return {
        code: props.children,
        lang: classNames && classNames[0].substring("language-".length),
        ...parseMetastring(props.metastring)
      };
    })
    .filter(x => x);
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // console.log(error, info);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    } else if (this.state.error.element) {
      return this.state.error.element;
    } else {
      throw this.state.error;
    }
  }
}
export default props => (
  <ErrorBoundary>
    <CodeSurferLayout {...props} />
  </ErrorBoundary>
);
