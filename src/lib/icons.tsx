import * as React from "react";

// ── Shared Icon Props ───────────────────────

export interface IconProps {
  className?: string;
  strokeWidth?: number;
}

// ── Helper ──────────────────────────────────

function icon(
  displayName: string,
  defaultStrokeWidth: number,
  children: React.ReactNode,
  fill: string = "none",
) {
  const Icon = React.memo(({ className, strokeWidth = defaultStrokeWidth }: IconProps) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  ));
  Icon.displayName = displayName;
  return Icon;
}

// ── Chevrons ────────────────────────────────

export const ChevronDownIcon = icon("ChevronDownIcon", 2, <path d="m6 9 6 6 6-6" />);
export const ChevronUpIcon = icon("ChevronUpIcon", 2, <path d="m18 15-6-6-6 6" />);
export const ChevronLeftIcon = icon("ChevronLeftIcon", 2, <path d="m15 18-6-6 6-6" />);
export const ChevronRightIcon = icon("ChevronRightIcon", 2, <path d="m9 18 6-6-6-6" />);
export const ChevronsLeftIcon = icon("ChevronsLeftIcon", 2, <><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></>);
export const ChevronsRightIcon = icon("ChevronsRightIcon", 2, <><path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" /></>);
export const ChevronsUpDownIcon = icon("ChevronsUpDownIcon", 2, <><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></>);

// ── Actions ─────────────────────────────────

export const XIcon = icon("XIcon", 2, <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const CheckIcon = icon("CheckIcon", 2.5, <path d="M20 6 9 17l-5-5" />);
export const MinusIcon = icon("MinusIcon", 2.5, <path d="M5 12h14" />);
export const PlusIcon = icon("PlusIcon", 2, <><path d="M5 12h14" /><path d="M12 5v14" /></>);
export const SearchIcon = icon("SearchIcon", 2, <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
export const ExternalLinkIcon = icon("ExternalLinkIcon", 2, <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>);

// ── UI ──────────────────────────────────────

export const EllipsisIcon = icon("EllipsisIcon", 2, <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>, "currentColor");
export const DotIcon = icon("DotIcon", 2, <circle cx="12" cy="12" r="5" />, "currentColor");
export const GripVerticalIcon = icon("GripVerticalIcon", 2, <><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></>, "currentColor");
export const GripHorizontalIcon = icon("GripHorizontalIcon", 2, <><circle cx="5" cy="9" r="1" /><circle cx="12" cy="9" r="1" /><circle cx="19" cy="9" r="1" /><circle cx="5" cy="15" r="1" /><circle cx="12" cy="15" r="1" /><circle cx="19" cy="15" r="1" /></>, "currentColor");
export const ColumnsIcon = icon("ColumnsIcon", 2, <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /><path d="M15 3v18" /></>);
export const PanelLeftIcon = icon("PanelLeftIcon", 2, <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></>);

// ── Media / Content ─────────────────────────

export const CalendarIcon = icon("CalendarIcon", 2, <><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>);
export const CalendarClockIcon = icon("CalendarClockIcon", 2, <><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h5" /><path d="M17.5 17.5 16 16.3V14" /><circle cx="16" cy="16" r="6" /></>);
export const CameraIcon = icon("CameraIcon", 2, <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>);
export const VideoIcon = icon("VideoIcon", 2, <><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" /><rect x="2" y="7" width="14" height="10" rx="2" /></>);
export const FileIcon = icon("FileIcon", 2, <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></>);
export const InboxIcon = icon("InboxIcon", 1, <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>);
export const UserIcon = icon("UserIcon", 2, <><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></>);

// ── Feedback ────────────────────────────────

export const InfoIcon = icon("InfoIcon", 2, <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>);
export const WarningIcon = icon("WarningIcon", 2, <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>);
export const ErrorIcon = icon("ErrorIcon", 2, <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>);
export const SuccessIcon = icon("SuccessIcon", 2, <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>);

// ── File Manager ────────────────────────────

export const FolderIcon = icon("FolderIcon", 2, <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />);
export const FolderOpenIcon = icon("FolderOpenIcon", 2, <><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" /></>);
export const FolderPlusIcon = icon("FolderPlusIcon", 2, <><path d="M12 10v6" /><path d="M9 13h6" /><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></>);
export const UploadIcon = icon("UploadIcon", 2, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></>);
export const DownloadIcon = icon("DownloadIcon", 2, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></>);
export const TrashIcon = icon("TrashIcon", 2, <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>);
export const PencilIcon = icon("PencilIcon", 2, <><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></>);
export const CopyIcon = icon("CopyIcon", 2, <><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>);
export const GridIcon = icon("GridIcon", 2, <><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /></>);
export const ListIcon = icon("ListIcon", 2, <><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></>);
export const FileTextIcon = icon("FileTextIcon", 2, <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></>);
export const FileImageIcon = icon("FileImageIcon", 2, <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="10" cy="12" r="2" /><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" /></>);
