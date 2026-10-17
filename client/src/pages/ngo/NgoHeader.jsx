import { Bell, Menu, Search, Settings } from "lucide-react";

const IconButton = ({ label, children, onClick, className = "" }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`rounded-md p-1.5 text-[#78695E] transition hover:bg-[#F0EEE5] ${className}`}
  >
    {children}
  </button>
);

export const NgoHeader = ({
  onMenuClick,
  onSearch,
  searchPlaceholder = "Search requests, donattions...",
  showSearch = true,
  profileLabel = "HB",
  onNotificationsClick,
  onSettingsClick,
  rightContent,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(event.currentTarget.elements.adminSearch.value.trim());
  };

  return (
    <header className="dashboard-header sticky top-0 z-20 flex h-[60px] items-center justify-between gap-3 border-b border-[#EEEAE0] bg-[#FBF9F1]/95 px-4 backdrop-blur md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <IconButton
          label="Toggle navigation"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu size={18} />
        </IconButton>

        {showSearch && (
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[330px] items-center gap-2 rounded-md border border-[#E9E5DA] bg-white/70 px-3 py-2"
          >
            <Search size={13} className="shrink-0 text-[#8A7A6E]" />
            <input
              name="adminSearch"
              aria-label="Search admin records"
              placeholder={searchPlaceholder}
              className="w-full bg-transparent font-app-body text-[12px] text-[#443A33] outline-none placeholder:text-[#9A8E83]"
            />
          </form>
        )}
      </div>

      <div className="ml-1 flex shrink-0 items-center gap-2">
        {rightContent}
        <IconButton label="Notifications" onClick={onNotificationsClick}>
          <Bell size={24} />
        </IconButton>
        <IconButton label="Settings" onClick={onSettingsClick}>
          <Settings size={24} />
        </IconButton>
        <button
          type="button"
          aria-label="Profile"
          className="grid h-12 w-12 place-items-center rounded-full border border-[#E4DED2] bg-white text-[14px] font-bold text-[#A9430B]"
        >
          {profileLabel}
        </button>
      </div>
    </header>
  );
};
