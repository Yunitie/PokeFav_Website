/**
 * Typographie selon le style et le composant
 */

import clsx from "clsx";

interface Props {
  variant?:
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "lead"
    | "body-lg"
    | "body-base"
    | "body-sm"
    | "caption1"
    | "caption2"
    | "caption3"
    | "caption4";
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "div" | "span";
  theme?:
    | "black"
    | "gray"
    | "gray-600"
    | "gray-500"
    | "white"
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning";
  weight?: "regular" | "medium";
  className?: string;
  children: React.ReactNode;
}

export const Typography = ({
  variant = "h3",
  component: Component = "div",
  theme = "black",
  weight = "regular",
  className = "",
  children,
}: Props) => {
  let variantClasses: string = "",
    colorClasses: string = "";

  // Définition des classes de taille selon la variante
  switch (variant) {
    case "display":
      variantClasses = "text-8xl";
      break;
    case "h1":
      variantClasses = "text-7xl";
      break;
    case "h2":
      variantClasses = "text-6xl";
      break;
    case "h3": //Default
      variantClasses = "text-5xl";
      break;
    case "h4":
      variantClasses = "text-4xl";
      break;
    case "h5":
      variantClasses = "text-3xl";
      break;
    case "lead":
      variantClasses = "text-2xl";
      break;
    case "body-lg":
      variantClasses = "text-lg";
      break;
    case "body-base":
      variantClasses = "text-base";
      break;
    case "body-sm":
      variantClasses = "text-sm";
      break;
    case "caption1":
      variantClasses = "text-caption1";
      break;
    case "caption2":
      variantClasses = "text-caption2";
      break;
    case "caption3":
      variantClasses = "text-caption3";
      break;
    case "caption4":
      variantClasses = "text-caption4";
      break;
  }

  // Définition des classes de couleur selon le thème
  switch (theme) {
    case "black": //Default
      colorClasses = "text-gray";
      break;
    case "gray":
      colorClasses = "text-gray-700";
      break;
    case "gray-600":
      colorClasses = "text-gray-600";
      break;
    case "gray-500":
      colorClasses = "text-gray-500";
      break;
    case "white":
      colorClasses = "text-white";
      break;
    case "primary":
      colorClasses = "text-primary";
      break;
    case "secondary":
      colorClasses = "text-secondary";
      break;
    case "danger":
      colorClasses = "text-alert-danger";
      break;
    case "success":
      colorClasses = "text-alert-success";
      break;
    case "warning":
      colorClasses = "text-alert-warning";
      break;
  }

  return (
    <Component
      className={clsx(
        variantClasses,
        colorClasses,
        weight === "medium" && "font-medium",
        className
      )}
    >
      {children}
    </Component>
  );
};
