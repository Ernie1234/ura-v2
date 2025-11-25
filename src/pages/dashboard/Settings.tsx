import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileMutationFn } from '@/lib/api';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

const schema = z.object({
  businessName: z.string().trim().max(100, 'Max 100 characters').optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Settings() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { businessName: user?.businessName || '' },
    values: { businessName: user?.businessName || '' },
  });

  const { mutateAsync } = useMutation({
    mutationFn: updateProfileMutationFn,
    onSuccess: () => {
      toast.success('Profile updated');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error: AxiosError) => {
      const msg = (error.response?.data as { message?: string })?.message;
      toast.error(msg || 'Update failed');
    },
  });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync({ businessName: values.businessName });
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="businessName">Business Name (optional)</Label>
          <Input id="businessName" placeholder="e.g. Acme Co." {...register('businessName')} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          Save
        </Button>
      </form>
    </div>
  );
}
