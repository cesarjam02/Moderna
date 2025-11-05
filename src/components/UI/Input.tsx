import { JSX } from 'preact/jsx-runtime';

export function Input(props: JSX.HTMLAttributes<HTMLInputElement>) {
  const baseClasses = "py-2 px-3 w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rojo-moderna focus:border-rojo-moderna";
  const combinedClasses = `${baseClasses} ${props.className || ''}`;
  const { className, ...rest } = props;

  return (
    <input
      {...rest}
      className={combinedClasses}
    />
  );
}