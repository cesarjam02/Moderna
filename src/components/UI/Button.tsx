import { JSX } from 'preact/jsx-runtime';

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return <button {...props} style={{ padding: '.5rem 1rem', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' }} />;
}