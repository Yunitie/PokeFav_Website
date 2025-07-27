import clsx from "clsx";

interface Props {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "white";
}

const Spinner = ({ size = "medium", variant = "primary" }: Props) => {
  let variantStyles: string = "",
    sizeStyles: string = "";

  switch (size) {
    case "small":
      sizeStyles = "w-5 h-5";
      break;
    case "medium": //Default
      sizeStyles = "w-9 h-9";
      break;
    case "large":
      sizeStyles = "w-12 h-12";
      break;
  }

  switch (variant) {
    case "primary": //Default
      variantStyles = "text-primary";
      break;
    case "white":
      variantStyles = "text-white";
      break;
  }

  return (
    <>
      <svg
        className={clsx(sizeStyles, variantStyles)}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <circle cx="12" cy="2.5" r="2.2" opacity=".14" />
          <circle cx="16.75" cy="3.77" r="2.2" opacity=".29" />
          <circle cx="20.23" cy="7.25" r="2.2" opacity=".43" />
          <circle cx="21.50" cy="12.00" r="2.2" opacity=".57" />
          <circle cx="20.23" cy="16.75" r="2.2" opacity=".71" />
          <circle cx="16.75" cy="20.23" r="2.2" opacity=".86" />
          <circle cx="12" cy="21.5" r="2.2" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            calcMode="discrete"
            dur="1.1s"
            values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
            repeatCount="indefinite"
          />
        </g>
      </svg>
    </>
  );
};

export default Spinner;
