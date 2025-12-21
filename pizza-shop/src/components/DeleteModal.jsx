const DeleteModal = ({ onClose, onConfirm, isLoading }) => {
  return (
    <>
      <div className="relative bg-white px-[2em] pt-[2.5em] pb-[1.5em] rounded-[18px] shadow-[0_4px_15px_rgba(0,0,0,0.4)] w-150 flex flex-col items-start gap-[1.5em]">
        <span
          className="absolute top-[1em] right-[1em] p-[.5em] cursor-pointer hover:bg-[rgba(0,0,0,0.05)] rounded-full"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="text-black"
            className="w-6"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </span>
        <div className="flex flex-col gap-[0.2em] mb-[1em]">
          <span className="text-[1.1rem] font-medium">
            Are you sure you want to delete this recipe?
          </span>
          <span className="text-[.9rem] text-[rgba(0,0,0,0.8)]">
            This change could be permanent.
          </span>
        </div>
        <div className="flex gap-[.5em] justify-end w-full translate-x-[.5em]">
          <button
            className="cursor-pointer px-[1.5em] py-[.8em] text-[1rem] rounded-lg [border:1px_solid_rgba(0,0,0,0.2)] bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] text-black font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer px-[1.5em] py-[.8em] text-[1rem] rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
