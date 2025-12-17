import { AlertTriangle, Loader2 } from "lucide-react";
// Inside BusinessWarningModal.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from '@/lib/axios-client';

import { useAuthContext } from "@/context/auth-provider";
import { toast } from "react-hot-toast";



const BusinessWarningModal = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await API.post("/user/convert-to-business");
    },
    onSuccess: () => {
      toast.success("Welcome to Business Mode!");
      // 1. Invalidate profile queries to refresh auth state
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Conversion failed");
    }
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Irreversible Action</h3>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Converting to a <strong>Business Account</strong> is permanent. This allows you to list products and receive reviews.
            <br /><br />
            Because business data (orders, reviews, products) is linked to your identity, you <strong>cannot switch back</strong> to a regular user account later.
          </p>

          <div className="flex flex-col w-full gap-3 mt-8">
            <button
              disabled={mutation.isPending}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : "I Understand, Convert Now"}
            </button>
            <button
              className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition"
              onClick={onClose}
            >
              Wait, Let me think
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default BusinessWarningModal;
