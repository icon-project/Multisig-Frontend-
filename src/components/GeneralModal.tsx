import React, { ReactNode } from 'react';

interface GeneralModalProps {
  show: boolean;
  closeHandler: () => void;
  title: string;
  description: string | ReactNode;
}

const GeneralModal: React.FC<GeneralModalProps> = ({ show, closeHandler, title, description }) => {
  if (!show) return null;

  return (
    <dialog className="d-modal d-modal-bottom sm:d-modal-middle d-modal-open">
      <div className="d-modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="d-modal-action flex-col">
          <div className="overflow-auto">{description}</div>

          <form method="dialog" className="flex justify-center mt-4">
            <button className="d-btn" onClick={closeHandler}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default GeneralModal;
