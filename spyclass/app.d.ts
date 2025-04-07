/// <reference types="react" />

declare namespace JSX {
    interface IntrinsicElements {
      // Define HTML elements that TypeScript doesn't recognize
      html: React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
      body: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
      // Add other elements as needed
    }
  }