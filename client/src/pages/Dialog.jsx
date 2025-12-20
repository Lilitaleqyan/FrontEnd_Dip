import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export const MyDialog = ({ triggerText, title, children }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{triggerText}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          {/* Եթե ուզում ես title-ը տեսանելի լինի */}
          <Dialog.Title>{title}</Dialog.Title>

          {/* Եթե ուզում ես title-ը թաքնված լինի accessibility-ի համար */}
          {/* <Dialog.Title>
            <VisuallyHidden>{title}</VisuallyHidden>
          </Dialog.Title> */}

          {children}

          <Dialog.Close className="dialog-close">Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
