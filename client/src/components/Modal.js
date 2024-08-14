import React from "react";

const Modal = ({
  btnModalName,
  modalTitle,
  modalDescription,
  children,
  btnColor,
  modalId,
  onOpen,
}) => {
  return (
    <>
      <button
        className={`btn btn-xs ${btnColor}`}
        onClick={() => {
          document.getElementById(modalId)?.showModal();
          if (onOpen) onOpen();
        }}
      >
        {btnModalName}
      </button>
      <dialog id={modalId} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">{modalTitle}</h3>
          <p className="py-4">{modalDescription}</p>
          <div className="modal-action">
            <form method="dialog" className="w-full flex gap-3 flex-col">
              {children}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
