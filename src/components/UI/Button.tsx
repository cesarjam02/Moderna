import { JSX } from 'preact/jsx-runtime';

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  // Clases base para todos los botones
  const baseClasses = "py-2 px-4 rounded-lg font-semibold cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Combina clases base con las que pases en `className`
  const combinedClasses = `${baseClasses} ${props.className || ''}`;

  const { className, ...rest } = props;

  return (
    <button
      {...rest}
      className={combinedClasses}
    />
  );
}