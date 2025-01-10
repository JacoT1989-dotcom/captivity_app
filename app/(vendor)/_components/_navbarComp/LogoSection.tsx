import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

interface LogoSectionProps {
  logoUrl: string | null;
  isLogoLoading: boolean;
  isVendor: boolean;
  isVendorCustomer: boolean;
  vendorWebsite: string;
  showRemoveButton: boolean;
  defaultLogoUrl: string;
  handleLogoUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleRemoveLogo: (e: React.MouseEvent) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const LogoSection = React.memo((props: LogoSectionProps) => (
  <div
    className="relative w-[170px] h-[54px] group"
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
  >
    {props.isLogoLoading ? (
      <div className="w-full h-full bg-gray-800 animate-pulse rounded" />
    ) : props.logoUrl ? (
      <Link
        href={
          props.isVendor || props.isVendorCustomer
            ? `/vendor/${props.vendorWebsite}`
            : "#"
        }
      >
        <div className="relative w-full h-full">
          <Image
            src={props.logoUrl}
            alt="Company Logo"
            fill
            className={`object-contain ${props.isVendor ? "hover:opacity-80" : ""}`}
            onClick={e => {
              if (props.isVendor && props.fileInputRef.current) {
                e.preventDefault();
                props.fileInputRef.current.click();
              }
            }}
            priority
          />
          {props.isVendor && props.showRemoveButton && !props.isLogoLoading && (
            <button
              onClick={props.handleRemoveLogo}
              className="absolute top-0 right-0 bg-red-500 p-1 rounded-bl-md hover:bg-red-600 transition-colors"
              title="Remove logo"
            >
              <Trash2 size={16} className="text-white" />
            </button>
          )}
        </div>
      </Link>
    ) : props.isVendor ? (
      <div
        className="w-full h-full border-2 border-dashed border-white flex items-center justify-center cursor-pointer hover:border-gray-300"
        onClick={() => props.fileInputRef.current?.click()}
      >
        <span className="text-sm text-center">
          {props.isLogoLoading ? "Uploading..." : "Click to upload logo"}
        </span>
      </div>
    ) : (
      <Link
        href={
          props.isVendorCustomer
            ? `/vendor/${props.vendorWebsite}`
            : "/vendor_admin"
        }
      >
        <Image
          src={props.defaultLogoUrl}
          alt="captivityLogo"
          width={331}
          height={54}
          className="h-auto border border-white hover:opacity-80 hover:border-2"
          priority
        />
      </Link>
    )}
    {props.isVendor && (
      <input
        ref={props.fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={props.handleLogoUpload}
        disabled={props.isLogoLoading}
      />
    )}
  </div>
));

LogoSection.displayName = "LogoSection";
