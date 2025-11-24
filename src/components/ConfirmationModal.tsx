import ReactModal from "react-modal";

export default function ConfirmationModal({
  prompt,
  yes,
  no,
  onConfirmation,
  onCancel,
}: {
  prompt: string;
  yes: string;
  no: string;
  onConfirmation: VoidFunction;
  onCancel: VoidFunction;
}) {
  return (
    <ReactModal
      isOpen={true}
      onRequestClose={onCancel}
      overlayClassName="modal-bg"
      className="modal"
    >
      <p>{prompt}</p>
      <div>
        <button onClick={onConfirmation} className="red">
          {yes}
        </button>
        <button onClick={onCancel}>{no}</button>
      </div>
    </ReactModal>
  );
}
