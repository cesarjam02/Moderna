import { FunctionalComponent } from 'preact';

export const Layout: FunctionalComponent<{ children: preact.ComponentChildren }> = ({ children }) => {
  return <div>{children}</div>;
};