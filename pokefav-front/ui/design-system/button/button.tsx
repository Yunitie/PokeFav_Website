"use client";

import clsx from "clsx";
import Spinner from "../spinner/spinner";
import { LinkType, LinkTypes } from "@/lib/link-type";
import Link from "next/link";
import { RiUser6Fill } from "react-icons/ri";

// Mapping des icônes disponibles
const iconMap = {
  user: RiUser6Fill,
};

interface Props {
  size?: "small" | "medium" | "large";
  variant?:
    | "accent"
    | "secondary"
    | "outline"
    | "disabled"
    | "ico"
    | "success"
    | "danger";
  iconName?: keyof typeof iconMap;
  iconTheme?: "accent" | "secondary" | "gray";
  iconPosition?: "left" | "right";
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  baseUrl?: string; //lien
  linkType?: LinkType; //internal external
  action?: () => void; //donner une fonction
  type?: "button" | "submit";
  fullWith?: boolean;
  className?: string;
}

const Button = ({
  size = "medium",
  variant = "accent",
  iconName,
  iconTheme = "accent",
  iconPosition = "right",
  disabled,
  isLoading,
  children,
  baseUrl,
  linkType = "internal",
  type = "button",
  fullWith = false,
  action = () => {},
  className,
}: Props) => {
  let variantStyles: string = "",
    sizeStyles: string = "",
    icoSize: number = 0;

  // Récupérer l'icône depuis le mapping
  const IconComponent = iconName ? iconMap[iconName] : null;

  switch (variant) {
    case "accent": //Default
      variantStyles = "bg-primary hover:bg-primary-400 text-white rounded";
      break;
    case "secondary":
      variantStyles =
        "bg-primary-200 hover:bg-primary-300/50 text-primary rounded";
      break;
    case "outline":
      variantStyles =
        "bg-white hover:bg-gray-400/50 border border-gray-500 text-gray-900 rounded";
      break;
    case "disabled":
      variantStyles =
        "bg-gray-400 border border-gray-500 text-gray-600 rounded cursor-not-allowed";
      break;
    case "success":
      variantStyles = "bg-secondary hover:bg-secondary-400 text-white rounded";
      break;
    case "danger":
      variantStyles =
        "bg-alert-danger hover:bg-alert-danger/75 text-white rounded";
      break;
    case "ico":
      if (iconTheme === "accent") {
        variantStyles =
          "bg-primary hover:bg-primary-400 text-white rounded-full ";
      }
      if (iconTheme === "secondary") {
        variantStyles =
          "bg-primary-200 hover:bg-primary-300/50 text-primary rounded-full ";
      }
      if (iconTheme === "gray") {
        variantStyles = "bg-gray-800 hover:bg-gray-700 text-white rounded-full";
      }
      break;
  }

  switch (size) {
    case "small":
      sizeStyles = `text-caption3 font-medium ${
        variant === "ico"
          ? "flex items-center justify-center w-[40px] h-[40px]"
          : "px-[14px] py-[12px]"
      }`;
      icoSize = 18;
      break;
    case "medium": //Default
      sizeStyles = `text-caption2 font-medium ${
        variant === "ico"
          ? "flex items-center justify-center w-[50px] h-[50px]"
          : "px-[18px] py-[15px]"
      }`;
      icoSize = 20;
      break;
    case "large":
      sizeStyles = `text-caption1 font-medium ${
        variant === "ico"
          ? "flex items-center justify-center w-[60px] h-[60px]"
          : "px-[22px] py-[18px]"
      }`;
      icoSize = 24;
      break;
  }

  const handleClick = () => {
    if (action) {
      action();
    }
  };

  const buttonContent = (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          {variant === "accent" ||
          (variant === "ico" && iconTheme !== "secondary") ? (
            <Spinner size="small" variant="white" />
          ) : (
            <Spinner size="small" />
          )}
        </div>
      )}
      <div className={clsx(isLoading && "invisible")}>
        {IconComponent && variant === "ico" ? (
          <IconComponent size={icoSize} />
        ) : (
          <div className={clsx(IconComponent && "flex items-center gap-1")}>
            {IconComponent && iconPosition === "left" && (
              <IconComponent size={icoSize} />
            )}
            {children}
            {IconComponent && iconPosition === "right" && (
              <IconComponent size={icoSize} />
            )}
          </div>
        )}
      </div>
    </>
  );

  const buttonElement = (
    <>
      <button
        type={type}
        className={clsx(
          variantStyles,
          sizeStyles,
          icoSize,
          isLoading && "cursor-not-allowed",
          fullWith && "w-full",
          "relative animate",
          className
        )}
        onClick={handleClick}
        disabled={disabled || isLoading ? true : false}
      >
        {buttonContent}
      </button>
    </>
  );

  if (baseUrl) {
    if (linkType === LinkTypes.EXTERNAL) {
      return (
        <a href={baseUrl} target="_blank">
          {buttonElement}
        </a>
      );
    } else {
      return <Link href={baseUrl}>{buttonElement}</Link>;
    }
  }
  return buttonElement;
};

export default Button;
