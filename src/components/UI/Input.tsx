import { JSX } from 'preact/jsx-runtime';

export function Input(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ padding: '.5rem .75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%' }} />;
}