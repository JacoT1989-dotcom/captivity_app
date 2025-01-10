interface StatusMessageProps {
  success?: string;
  error?: string;
}

export const StatusMessage = ({ success, error }: StatusMessageProps) => {
  if (!success && !error) return null;

  return (
    <>
      {success && (
        <div className="bg-muted border border-border text-primary px-4 py-3 rounded-md relative mt-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-700 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-destructive/10 border border-border text-destructive px-4 py-3 rounded-md relative mt-4 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </>
  );
};
