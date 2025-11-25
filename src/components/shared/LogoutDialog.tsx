import { useCallback } from 'react';
import { Loader } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/api/use-auth-mutations';

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isOpen, setIsOpen } = props;

  const { mutate, isPending } = useLogout();

  const handleLogout = useCallback(() => {
if (isPending) return;
    // The useLogout hook is configured to handle tokens,
    // so we can call mutate() with no arguments here.
    // However, the onSuccess/onError logic of useLogout redirects
    // to /auth/login and shows a toast.
 mutate(undefined, {
      onSuccess: () => {
        // We still need to close the dialog locally
        setIsOpen(false);
        // The useLogout hook handles navigation and toast for success
      },
      onError: () => {
        // The useLogout hook handles navigation and toast for error
        setIsOpen(false);
      }
    });
 }, [isPending, mutate, setIsOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogDescription>
              This will end your current session and you will need to log in again to access your
              account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isPending} type="button" onClick={handleLogout}>
              {isPending && <Loader className="animate-spin" />}
              Sign out
            </Button>
            <Button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
